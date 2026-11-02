// Data + auth through the Worker API (worker/index.ts). Login is verified on the server;
// the session is an HttpOnly cookie the browser sends automatically.
import type { Site, SiteInput } from './types';

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
  });
  if (res.status === 401 && path !== '/api/login') throw new Error('unauthorized');
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Returns null on success, or an error code ('invalid', 'too_many_attempts', ...). */
export async function signIn(email: string, password: string): Promise<string | null> {
  try {
    await call('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : 'error';
  }
}

export async function currentUser(): Promise<string | null> {
  try {
    return (await call<{ email: string }>('/api/me')).email;
  } catch {
    return null;
  }
}

export async function signOut() {
  await call('/api/logout', { method: 'POST', body: '{}' }).catch(() => {});
}

export async function listSites(): Promise<Site[]> {
  const sites = await call<Site[]>('/api/sites');
  return sites.map((s) => ({ ...s, price: Number(s.price) || 0, paid: Number(s.paid) || 0 }));
}

export async function saveSite(input: SiteInput, id?: string): Promise<void> {
  await call('/api/sites', { method: 'POST', body: JSON.stringify({ ...input, domain_expires: input.domain_expires || null, id }) });
}

export async function deleteSite(id: string): Promise<void> {
  await call(`/api/sites/${encodeURIComponent(id)}`, { method: 'DELETE', body: '{}' });
}

// Generic shared collections (leads, todos) — same KV store as sites.
export type Col = 'leads' | 'todos';
export async function listCol<T>(col: Col): Promise<T[]> {
  return call<T[]>(`/api/c/${col}`);
}

export async function saveItem(col: Col, input: object, id?: string): Promise<void> {
  await call(`/api/c/${col}`, { method: 'POST', body: JSON.stringify({ ...input, id }) });
}

export async function deleteItem(col: Col, id: string): Promise<void> {
  await call(`/api/c/${col}/${encodeURIComponent(id)}`, { method: 'DELETE', body: '{}' });
}
