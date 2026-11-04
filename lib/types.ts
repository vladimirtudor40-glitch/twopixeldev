import type { Category, ExtraLine } from './pricing';
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
  { id: 'eve', label: 'Evelina' },
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

// ---------- CRM: clienți, proiecte, plăți ----------

export type Client = {
  id: string;
  name: string;            // persoană de contact sau firmă
  company: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  cui: string | null;      // CUI / CIF pentru facturare
  owner: Owner;
  notes: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: string;
};
export type ClientInput = Omit<Client, 'id' | 'created_at' | 'updated_at' | 'updated_by'>;
export const emptyClient = (): ClientInput => ({
  name: '', company: '', phone: '', email: '', city: '', cui: '', owner: 'amandoi', notes: '',
});

export const PROJECT_STATUSES = [
  { id: 'oferta', label: 'Ofertă' },
  { id: 'in_lucru', label: 'În lucru' },
  { id: 'review', label: 'La client' },
  { id: 'livrat', label: 'Livrat' },
  { id: 'mentenanta', label: 'Mentenanță' },
  { id: 'pauza', label: 'Pauză' },
  { id: 'anulat', label: 'Anulat' },
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]['id'];
export const projectStatusLabel = (s: ProjectStatus) => PROJECT_STATUSES.find((x) => x.id === s)?.label ?? s;

export type Project = {
  id: string;
  name: string;
  client_id: string | null;
  site_id: string | null;
  category: Category;
  package_id: string | null;
  base_price: number;       // prețul pachetului ales (poate fi ajustat în interval)
  extras: ExtraLine[];
  urgent: boolean;
  discount: number;         // %
  price: number;            // total ofertat, fără TVA
  currency: string;
  plan_id: string | null;   // abonament de mentenanță
  plan_monthly: number;
  status: ProjectStatus;
  owner: Owner;
  start: string | null;     // YYYY-MM-DD
  deadline: string | null;
  progress: number;         // 0-100
  notes: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: string;
};
export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'updated_by'>;
export const emptyProject = (): ProjectInput => ({
  name: '', client_id: null, site_id: null, category: 'site', package_id: 'site-start', base_price: 3200, extras: [],
  urgent: false, discount: 0, price: 3200, currency: 'RON', plan_id: 'basic', plan_monthly: 150,
  status: 'oferta', owner: 'amandoi', start: null, deadline: null, progress: 0, notes: '',
});

export const PAYMENT_KINDS = [
  { id: 'avans', label: 'Avans' },
  { id: 'transa', label: 'Tranșă' },
  { id: 'final', label: 'Final' },
  { id: 'mentenanta', label: 'Mentenanță' },
  { id: 'domeniu', label: 'Domeniu / hosting' },
  { id: 'altul', label: 'Altul' },
] as const;
export type PaymentKind = (typeof PAYMENT_KINDS)[number]['id'];
export const paymentKindLabel = (k: PaymentKind) => PAYMENT_KINDS.find((x) => x.id === k)?.label ?? k;

export type Payment = {
  id: string;
  project_id: string | null;
  client_id: string | null;
  label: string;
  amount: number;
  currency: string;
  kind: PaymentKind;
  paid: boolean;
  date: string | null;      // data încasării (sau scadența dacă nu e încasată)
  invoice: string | null;   // nr. factură
  notes: string | null;
  created_at: string;
  updated_at: string;
  updated_by?: string;
};
export type PaymentInput = Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'updated_by'>;
export const emptyPayment = (): PaymentInput => ({
  project_id: null, client_id: null, label: '', amount: 0, currency: 'RON', kind: 'avans', paid: true,
  date: new Date().toISOString().slice(0, 10), invoice: '', notes: '',
});
