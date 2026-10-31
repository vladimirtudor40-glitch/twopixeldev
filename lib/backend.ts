// Data + auth. Uses Supabase when NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are set;
// otherwise a local DEMO mode (browser storage, any login works) so the app can be previewed.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Site, SiteInput } from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isDemo = !url || !key;
let sb: SupabaseClient | null = null;
const client = () => (sb ??= createClient(url!, key!));

// ── demo storage ──
const DEMO_USER = 'tpd-demo-user';
const DEMO_SITES = 'tpd-demo-sites';
const read = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const now = () => new Date().toISOString();
const seed = (): Site[] => {
  const base = { client_phone: '', client_email: '', hosting: '', currency: 'RON', repo_url: '', notes: '', created_at: now(), updated_at: now() };
  return [
    { ...base, id: 'd1', name: 'Barbershop Constanța', client_name: 'Barbershop Constanța', domain: '', domain_expires: null, status: 'in_lucru', price: 0, paid: 0, owner: 'amandoi', live_url: '' },
    { ...base, id: 'd2', name: "Men's Cave Barbershop", client_name: "Men's Cave", domain: '', domain_expires: null, status: 'in_lucru', price: 0, paid: 0, owner: 'amandoi', live_url: '' },
    { ...base, id: 'd3', name: 'Zorile Mării', client_name: 'Zorile Mării', domain: '', domain_expires: null, status: 'in_lucru', price: 0, paid: 0, owner: 'amandoi', live_url: '' },
  ];
};

// ── auth ──
export async function signIn(email: string, password: string): Promise<string | null> {
  if (isDemo) { write(DEMO_USER, email); return null; }
  const { error } = await client().auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

export async function currentUser(): Promise<string | null> {
  if (isDemo) return read<string | null>(DEMO_USER, null);
  const { data } = await client().auth.getSession();
  return data.session?.user.email ?? null;
}

export async function signOut() {
  if (isDemo) { try { localStorage.removeItem(DEMO_USER); } catch {} return; }
  await client().auth.signOut();
}

// ── sites ──
export async function listSites(): Promise<Site[]> {
  if (isDemo) { const s = read<Site[] | null>(DEMO_SITES, null); if (s) return s; const x = seed(); write(DEMO_SITES, x); return x; }
  const { data, error } = await client().from('sites').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as Site[]).map((s) => ({ ...s, price: Number(s.price), paid: Number(s.paid) }));
}

export async function saveSite(input: SiteInput, id?: string): Promise<void> {
  const clean = { ...input, domain_expires: input.domain_expires || null };
  if (isDemo) {
    const all = await listSites();
    const next = id
      ? all.map((s) => (s.id === id ? { ...s, ...clean, updated_at: now() } : s))
      : [{ ...clean, id: crypto.randomUUID(), created_at: now(), updated_at: now() }, ...all];
    write(DEMO_SITES, next);
    return;
  }
  const q = id ? client().from('sites').update(clean).eq('id', id) : client().from('sites').insert(clean);
  const { error } = await q;
  if (error) throw error;
}

export async function deleteSite(id: string): Promise<void> {
  if (isDemo) { write(DEMO_SITES, (await listSites()).filter((s) => s.id !== id)); return; }
  const { error } = await client().from('sites').delete().eq('id', id);
  if (error) throw error;
}
