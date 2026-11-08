// twopixeldev Worker: serves the static site and guards the internal app.
// - Login is checked here, on the server, against the USERS secret (PBKDF2 hashes).
// - A signed, HttpOnly session cookie protects /app and /api.
// - Site records live in the SITES KV namespace, shared by both accounts.
// - The login page has no public link: it is served only at /app/<LOGIN_KEY> (a Wrangler secret).

import { LOGIN_HTML } from './login-page';

interface Fetcher { fetch(req: Request): Promise<Response> }
interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}
interface Env {
  ASSETS: Fetcher;
  SITES: KV;
  /** JSON: { "email": "pbkdf2$<iterations>$<saltB64>$<hashB64>" } */
  USERS: string;
  /** Optional JSON {email: hash} that overrides USERS per account (to change one password without the others). */
  USERS_OVERRIDE?: string;
  /** Random string used to sign session cookies. */
  SESSION_SECRET: string;
  /** Secret path segment: the login page lives at /app/<LOGIN_KEY>. Unset = no login page. */
  LOGIN_KEY?: string;
  /** Where the twopixeldev CRM web build runs (Netlify), e.g. https://twopixeldev-crm.netlify.app */
  CRM_ORIGIN?: string;
  /** Shared secret the CRM checks on every request (same value as in the CRM's Netlify settings, 32+ chars). */
  CRM_PROXY_SECRET?: string;
}

const COOKIE = 'tpd_session';
const SESSION_DAYS = 30;
const MAX_FAILS = 8; // per IP per 15 minutes
const enc = new TextEncoder();

const b64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64url = (s: string) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s: string) => atob(s.replace(/-/g, '+').replace(/_/g, '/'));

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

function sameBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

async function verifyPassword(password: string, stored: string) {
  const [alg, iter, salt, hash] = stored.split('$');
  if (alg !== 'pbkdf2') return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: unb64(salt), iterations: Number(iter) },
    key,
    256,
  );
  return sameBytes(new Uint8Array(bits), unb64(hash));
}

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

async function makeSession(env: Env, email: string) {
  const payload = b64url(JSON.stringify({ e: email, x: Date.now() + SESSION_DAYS * 86_400_000 }));
  return `${payload}.${b64url(await hmac(env.SESSION_SECRET, payload))}`;
}

async function readSession(req: Request, env: Env): Promise<string | null> {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [payload, sig] = m[1].split('.');
  if (!payload || !sig) return null;
  const expected = b64url(await hmac(env.SESSION_SECRET, payload));
  if (!sameBytes(enc.encode(sig), enc.encode(expected))) return null;
  try {
    const { e, x } = JSON.parse(unb64url(payload)) as { e: string; x: number };
    if (Date.now() > x) return null;
    const users = loadUsers(env);
    return users[e] ? e : null; // removing a user from USERS logs them out
  } catch {
    return null;
  }
}

// Only the accounts in USERS exist; USERS_OVERRIDE can only replace their hashes.
function loadUsers(env: Env): Record<string, string> {
  const users = JSON.parse(env.USERS) as Record<string, string>;
  let extra: Record<string, string> = {};
  try { extra = JSON.parse(env.USERS_OVERRIDE || '{}'); } catch { /* ignore a malformed override */ }
  for (const [e, h] of Object.entries(extra)) if (e in users && typeof h === 'string') users[e] = h;
  return users;
}

const cookie = (value: string, maxAge: number) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

async function login(req: Request, env: Env) {
  const ip = req.headers.get('cf-connecting-ip') || 'unknown';
  const failKey = `fail:${ip}`;
  const fails = Number((await env.SITES.get(failKey)) || 0);
  if (fails >= MAX_FAILS) return json({ error: 'too_many_attempts' }, 429);

  let email = '', password = '';
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    email = String(body.email || '').trim().toLowerCase();
    password = String(body.password || '');
  } catch { /* fall through to rejection */ }

  const users = loadUsers(env);
  const stored = users[email];
  // Always run a hash so timing does not reveal which emails exist.
  const ok = await verifyPassword(password, stored || 'pbkdf2$100000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=');
  if (!stored || !ok) {
    await env.SITES.put(failKey, String(fails + 1), { expirationTtl: 900 });
    return json({ error: 'invalid' }, 401);
  }
  return json({ email }, 200, { 'set-cookie': cookie(await makeSession(env, email), SESSION_DAYS * 86400) });
}

type Item = { id: string; [k: string]: unknown };

// Shared collections in KV, one key per collection. `sites` is the original one.
const SEEDS: Record<string, Record<string, unknown>[]> = { sites: [], leads: [], todos: [], clients: [], projects: [], payments: [] };
const COLLECTIONS = Object.keys(SEEDS);

async function loadCol(env: Env, col: string): Promise<Item[]> {
  const raw = await env.SITES.get(col);
  if (raw !== null) return JSON.parse(raw) as Item[];
  // First read: fill with the starting data so both accounts see the same list.
  const now = new Date().toISOString();
  const seeded = SEEDS[col].map((x) => ({ ...x, id: crypto.randomUUID(), created_at: now, updated_at: now, updated_by: 'seed' }));
  await env.SITES.put(col, JSON.stringify(seeded));
  return seeded;
}
const storeCol = (env: Env, col: string, items: Item[]) => env.SITES.put(col, JSON.stringify(items));

async function saveItem(req: Request, env: Env, col: string, user: string) {
  const input = (await req.json()) as Partial<Item>;
  const items = await loadCol(env, col);
  const now = new Date().toISOString();
  const i = input.id ? items.findIndex((s) => s.id === input.id) : -1;
  let saved: Item;
  if (i >= 0) {
    saved = { ...items[i], ...input, id: items[i].id, updated_at: now, updated_by: user };
    items[i] = saved;
  } else {
    saved = { ...input, id: crypto.randomUUID(), created_at: now, updated_at: now, updated_by: user };
    items.unshift(saved);
  }
  await storeCol(env, col, items);
  return json(saved);
}

async function deleteItem(env: Env, col: string, id: string) {
  await storeCol(env, col, (await loadCol(env, col)).filter((s) => s.id !== id));
  return json({ ok: true });
}

async function api(req: Request, env: Env, path: string) {
  const method = req.method;
  // Mutations must be JSON (blocks plain cross-site form posts; cookie is SameSite=Strict too).
  if (method !== 'GET' && !(req.headers.get('content-type') || '').includes('application/json')) {
    return json({ error: 'bad_request' }, 400);
  }
  if (path === '/api/login' && method === 'POST') return login(req, env);
  if (path === '/api/logout' && method === 'POST') return json({ ok: true }, 200, { 'set-cookie': cookie('', 0) });

  const user = await readSession(req, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  if (path === '/api/me' && method === 'GET') return json({ email: user });

  // /api/sites (original) and /api/c/<collection> for leads, todos, clients, projects, payments
  const m = path.match(/^\/api\/(?:c\/)?(\w+)(?:\/([\w-]+))?$/);
  if (m && COLLECTIONS.includes(m[1])) {
    const [, col, id] = m;
    if (!id && method === 'GET') return json(await loadCol(env, col));
    if (!id && method === 'POST') return saveItem(req, env, col, user);
    if (id && method === 'DELETE') return deleteItem(env, col, id);
  }

  return json({ error: 'not_found' }, 404);
}

// ---------- CRM (twopixeldev-crm repo), embedded in /app → Clienți ----------
// /app/crm/* goes to the CRM (Netlify) only for signed-in users. The CRM has no login of its own: it trusts
// the account email we send in x-tpd-user, because the request also carries CRM_PROXY_SECRET.
const CRM_PREFIX = '/app/crm';

const crmUnavailable = (msg: string) =>
  new Response(`<!doctype html><meta charset="utf-8"><body style="font-family:ui-monospace,Menlo,monospace;padding:32px;color:#a3acbd;background:#121419">${msg}</body>`, {
    status: 503,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });

async function crm(req: Request, env: Env, email: string): Promise<Response> {
  const secret = env.CRM_PROXY_SECRET || '';
  let origin: URL;
  try { origin = new URL(env.CRM_ORIGIN || ''); } catch {
    return crmUnavailable('CRM-ul nu e conectat încă (CRM_ORIGIN lipsește din Worker).');
  }
  if (secret.length < 32) return crmUnavailable('CRM-ul nu e conectat încă (CRM_PROXY_SECRET lipsește din Worker).');

  const src = new URL(req.url);
  const target = new URL(src.pathname + src.search, origin);
  const headers = new Headers(req.headers);
  // Never let the browser choose who it is: drop any x-tpd-* it sent, then set ours.
  for (const k of [...headers.keys()]) if (k.startsWith('x-tpd-')) headers.delete(k);
  headers.delete('host');
  headers.delete('cookie'); // the site session stays here; the CRM does not need it
  headers.set('x-tpd-user', email);
  headers.set('x-tpd-proxy', secret);
  headers.set('x-forwarded-host', src.host);

  let res: Response;
  try {
    res = await fetch(target, { method: req.method, headers, body: req.body, redirect: 'manual' });
  } catch {
    return crmUnavailable('CRM-ul nu răspunde acum. Reîncearcă în câteva secunde.');
  }
  const out = new Response(res.body, res);
  // Redirects that name the CRM host go back through the site.
  const loc = out.headers.get('location');
  if (loc && loc.startsWith(origin.origin)) out.headers.set('location', src.origin + loc.slice(origin.origin.length));
  out.headers.delete('set-cookie');
  // Only this site may frame it; the CRM pages are private.
  out.headers.set('x-frame-options', 'SAMEORIGIN');
  out.headers.set('content-security-policy', "frame-ancestors 'self'");
  out.headers.set('x-robots-tag', 'noindex, nofollow');
  if (!src.pathname.startsWith(`${CRM_PREFIX}/_next/static/`)) out.headers.set('cache-control', 'no-store');
  return out;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith('/api/')) return api(req, env, path);

    // The internal app is only served to signed-in users.
    if (path === '/app' || path.startsWith('/app/')) {
      const key = (env.LOGIN_KEY || '').trim();
      if (key.length >= 8 && (path === `/app/${key}` || path === `/app/${key}/`)) {
        return new Response(LOGIN_HTML, {
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store',
            'x-robots-tag': 'noindex, nofollow',
            'referrer-policy': 'no-referrer',
            'x-frame-options': 'DENY',
          },
        });
      }
      const user = await readSession(req, env);
      if (!user) return Response.redirect(`${url.origin}/`, 302);
      if (path === CRM_PREFIX || path.startsWith(`${CRM_PREFIX}/`)) return crm(req, env, user);
      const res = await env.ASSETS.fetch(req);
      const out = new Response(res.body, res);
      out.headers.set('cache-control', 'no-store');
      return out;
    }

    return env.ASSETS.fetch(req);
  },
};
