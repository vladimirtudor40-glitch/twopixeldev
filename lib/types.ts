export const STATUSES = [
  { id: 'oferta', label: 'Ofertă' },
  { id: 'in_lucru', label: 'În lucru' },
  { id: 'live', label: 'Live' },
  { id: 'mentenanta', label: 'Mentenanță' },
  { id: 'pauza', label: 'Pauză' },
] as const;

export const OWNERS = [
  { id: 'amandoi', label: 'Amândoi' },
  { id: 'vladimir', label: 'Vladimir' },
  { id: 'eve', label: 'Eve' },
] as const;

export type Status = (typeof STATUSES)[number]['id'];
export type Owner = (typeof OWNERS)[number]['id'];

export type Site = {
  id: string;
  name: string;
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  domain: string | null;
  domain_expires: string | null; // YYYY-MM-DD
  hosting: string | null;
  status: Status;
  price: number;
  paid: number;
  currency: string;
  owner: Owner;
  live_url: string | null;
  repo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteInput = Omit<Site, 'id' | 'created_at' | 'updated_at'>;

export const emptySite = (): SiteInput => ({
  name: '', client_name: '', client_phone: '', client_email: '', domain: '', domain_expires: null,
  hosting: '', status: 'in_lucru', price: 0, paid: 0, currency: 'RON', owner: 'amandoi',
  live_url: '', repo_url: '', notes: '',
});

export const statusLabel = (s: Status) => STATUSES.find((x) => x.id === s)?.label ?? s;
export const ownerLabel = (o: Owner) => OWNERS.find((x) => x.id === o)?.label ?? o;

/** Days until the domain expires (negative = expired), or null. */
export function daysLeft(date: string | null) {
  if (!date) return null;
  const ms = new Date(date + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime();
  return Math.round(ms / 86_400_000);
}

// ---------- Leaduri ----------
export const LEAD_STATUSES = [
  { id: 'nou', label: 'Nou' },
  { id: 'contactat', label: 'Contactat' },
  { id: 'raspuns', label: 'A răspuns' },
  { id: 'oferta', label: 'Ofertă trimisă' },
  { id: 'castigat', label: 'Câștigat' },
  { id: 'pierdut', label: 'Pierdut' },
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number]['id'];

export type Lead = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  score: number; // 1-10
  status: LeadStatus;
  owner: Owner;
  next_step: string | null;
  pitch: string | null;
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: string;
};
export type LeadInput = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'updated_by'>;
export const emptyLead = (): LeadInput => ({
  name: '', category: '', city: 'Constanța', address: '', phone: '', website: '', score: 5,
  status: 'nou', owner: 'amandoi', next_step: '', pitch: '', notes: '', source: '',
});
export const leadStatusLabel = (s: LeadStatus) => LEAD_STATUSES.find((x) => x.id === s)?.label ?? s;

// ---------- To-do ----------
export type Todo = {
  id: string;
  title: string;
  done: boolean;
  owner: Owner;
  due: string | null; // YYYY-MM-DD
  site_id: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: string;
};
