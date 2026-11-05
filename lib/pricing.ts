// Internal twopixeldev price list (RON, without VAT), mirrored from the price-list doc of 2026-11-04.
// Used by the CRM to pre-fill project prices. Edit here when the list changes.

export type Category = 'site' | 'magazin' | 'aplicatie' | 'automatizare' | 'design' | 'altul';

export const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'site', label: 'Site-uri', color: 'var(--c1)' },
  { id: 'magazin', label: 'Magazine', color: 'var(--c2)' },
  { id: 'aplicatie', label: 'Aplicații', color: 'var(--c3)' },
  { id: 'automatizare', label: 'Automatizări', color: 'var(--c4)' },
  { id: 'design', label: 'Design', color: 'var(--c5)' },
  { id: 'altul', label: 'Altele', color: 'var(--c6)' },
];
export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? c;

export type Package = {
  id: string;
  category: Category;
  name: string;
  /** Starting price in RON. */
  price: number;
  /** Upper end for ranges ("12.000–25.000"). */
  max?: number;
  /** True for "de la ..." prices. */
  from?: boolean;
  /** Below this, the project is not worth taking. */
  min?: number;
  term?: string;
  includes: string;
  /** Suggested maintenance plan. */
  plan?: string;
};

export const PACKAGES: Package[] = [
  { id: 'landing', category: 'site', name: 'Landing page', price: 1900, min: 1700, term: '1 săpt.', plan: 'basic',
    includes: 'O pagină lungă cu secțiuni, formular sau WhatsApp, design pe brand, mobil, SEO de bază, Analytics, GDPR' },
  { id: 'site-start', category: 'site', name: 'Site prezentare Start', price: 3200, min: 2700, term: '2 săpt.', plan: 'basic',
    includes: 'Până la 5 pagini, formular cu email, hartă, SEO on-page, sitemap, GDPR și cookies, SAL ANPC, 1 lună Basic' },
  { id: 'site-business', category: 'site', name: 'Site prezentare Business', price: 6500, min: 5700, term: '3–4 săpt.', plan: 'standard',
    includes: '6–10 pagini, design custom cu machetă, blog sau portofoliu, viteză, SEO tehnic, 1 lună Standard' },
  { id: 'site-premium', category: 'site', name: 'Site Premium', price: 12500, from: true, min: 11000, term: '5–8 săpt.', plan: 'standard',
    includes: 'Până la 15 pagini, animații, RO + EN, o integrare, panou de administrare, 3 luni Standard' },
  { id: 'shop-start', category: 'magazin', name: 'Magazin online Start', price: 7500, min: 6500, term: '3–4 săpt.', plan: 'magazin',
    includes: 'Până la 100 produse, card + ramburs, facturare automată, curier, istoric preț 30 zile, ANPC complet' },
  { id: 'shop-pro', category: 'magazin', name: 'Magazin online Pro', price: 13500, min: 11500, term: '5–7 săpt.', plan: 'magazin',
    includes: 'Până la 2.000 produse, filtre, import Excel/feed, cupoane, AWB automat, Google Shopping, 1 lună Magazin' },
  { id: 'shop-b2b', category: 'magazin', name: 'Magazin B2B / avansat', price: 22000, from: true, min: 19000, term: '2–4 luni', plan: 'magazin',
    includes: 'Cont distribuitor, prețuri pe client, aprobare comenzi, sincronizare stoc ERP, multi-limbă/monedă' },
  { id: 'app-spec', category: 'aplicatie', name: 'Specificație și estimare', price: 1000, term: '1 săpt.',
    includes: 'Atelier, listă de funcții, schițe de ecrane, estimare pe etape. Se scade din proiect dacă semnează' },
  { id: 'app-web-mvp', category: 'aplicatie', name: 'Aplicație web MVP', price: 12000, max: 25000, min: 10000, term: '1–2 luni', plan: 'sla',
    includes: 'Conturi și login, 3–5 module, panou admin, bază de date, Cloudflare, 1 lună garanție' },
  { id: 'app-web-mid', category: 'aplicatie', name: 'Aplicație web medie', price: 25000, max: 60000, term: '3–5 luni', plan: 'sla',
    includes: 'Portal clienți, rezervări sau dashboard, roluri, plăți, email-uri automate, integrări, 3 luni garanție' },
  { id: 'app-mobile-mvp', category: 'aplicatie', name: 'Aplicație mobilă MVP', price: 18000, max: 35000, term: '2–3 luni', plan: 'sla',
    includes: 'iOS + Android dintr-o bază de cod, login, 3–5 ecrane, push, publicare în magazine' },
  { id: 'app-mobile-full', category: 'aplicatie', name: 'Aplicație mobilă completă', price: 35000, max: 80000, term: '3–6 luni', plan: 'sla',
    includes: 'Ca MVP, plus plăți în aplicație, offline, panou web admin, statistici' },
  { id: 'app-internal', category: 'aplicatie', name: 'Software intern (CRM, gestiune)', price: 15000, from: true, term: '1–4 luni', plan: 'sla',
    includes: 'Pe fluxul firmei: clienți, comenzi, stocuri sau programe, export Excel, acces doar angajați' },
  { id: 'auto-simple', category: 'automatizare', name: 'Automatizare simplă', price: 600, max: 1200,
    includes: 'Un flux: formular → email, Sheets, CRM sau WhatsApp; confirmări automate' },
  { id: 'auto-billing', category: 'automatizare', name: 'Integrare facturare / curier', price: 1500, max: 3000,
    includes: 'Oblio sau SmartBill cu e-Factura, AWB automat (Sameday, FAN, Cargus, Innoship)' },
  { id: 'auto-erp', category: 'automatizare', name: 'Integrare marketplace / ERP', price: 3000, max: 6000,
    includes: 'Sincronizare produse, stocuri și comenzi cu eMAG, ERP sau furnizor' },
  { id: 'auto-ai', category: 'automatizare', name: 'Chatbot / asistent AI', price: 2500, max: 6000,
    includes: 'Asistent pe site sau WhatsApp, preluare leaduri. Costul API se facturează lunar separat' },
  { id: 'auto-flow', category: 'automatizare', name: 'Flux de lucru complex', price: 4000, max: 10000,
    includes: 'Mai multe sisteme legate: oferte, aprobări, rapoarte automate, notificări' },
  { id: 'logo', category: 'design', name: 'Logo', price: 800, max: 1500,
    includes: '3 propuneri, 2 runde de modificări, SVG/PNG/PDF, variantă deschisă și închisă' },
  { id: 'brand', category: 'design', name: 'Identitate vizuală', price: 2000, max: 4000,
    includes: 'Logo, culori, fonturi, ghid de brand, cărți de vizită, șabloane social media' },
  { id: 'ui-site', category: 'design', name: 'Design UI site (Figma)', price: 2500, max: 5000,
    includes: 'Machete desktop + mobil, până la 8 pagini, componente, 2 runde' },
  { id: 'ui-app', category: 'design', name: 'Design UI/UX aplicație', price: 4000, max: 12000,
    includes: 'Fluxuri, wireframe-uri, machete pentru toate ecranele, prototip clicabil' },
  { id: 'ux-audit', category: 'design', name: 'Audit UX', price: 1200,
    includes: 'Analiză site existent, probleme ordonate după impact, recomandări concrete' },
  { id: 'migrate', category: 'altul', name: 'Mutare site de la alt furnizor', price: 500, max: 1000, includes: 'Mutare fișiere, bază de date, DNS, email' },
  { id: 'repair', category: 'altul', name: 'Reparare site spart', price: 800, from: true, includes: 'Curățare, actualizări, parole noi, backup' },
  { id: 'ads-setup', category: 'altul', name: 'Configurare Google / Meta Ads', price: 800, includes: 'Conturi, conversii, prima campanie' },
  { id: 'gbp', category: 'altul', name: 'SEO + Google Business Profile', price: 1200, includes: 'Configurare profil, categorii, poze, SEO local' },
  { id: 'custom', category: 'altul', name: 'Altceva (preț manual)', price: 0, includes: 'Lucrare în afara listei: estimezi zile × 1.000 RON + 20%' },
];
export const packageById = (id: string | null | undefined) => PACKAGES.find((p) => p.id === id);

export type Plan = { id: string; name: string; monthly: number; fits: string; includes: string };
export const PLANS: Plan[] = [
  { id: 'basic', name: 'Basic', monthly: 150, fits: 'Landing, site Start', includes: 'Găzduire, SSL, domeniu, backup săptămânal, 30 min modificări' },
  { id: 'standard', name: 'Standard', monthly: 300, fits: 'Site Business / Premium', includes: 'Basic + backup zilnic, monitorizare 24/7, 1,5 h, raport lunar' },
  { id: 'magazin', name: 'Magazin', monthly: 650, fits: 'Magazine online', includes: 'Standard + 3 h, verificare plăți/facturi/AWB, răspuns în 4 h' },
  { id: 'sla', name: 'Aplicație (SLA)', monthly: 1200, fits: 'Aplicații, software intern', includes: 'Monitorizare, bug-uri, 6 h dezvoltare, răspuns în aceeași zi' },
];
export const planById = (id: string | null | undefined) => PLANS.find((p) => p.id === id);

/** Extras priced per unit (RON) or as a percentage of the package. */
export type Extra = { id: string; name: string; unit?: number; pct?: number; per: string };
export const EXTRAS: Extra[] = [
  { id: 'page', name: 'Pagină suplimentară', unit: 350, per: 'pagină' },
  { id: 'lang', name: 'Limbă suplimentară', pct: 30, per: 'limbă' },
  { id: 'copy', name: 'Texte (copywriting)', unit: 150, per: 'pagină' },
  { id: 'blog', name: 'Articol blog SEO', unit: 250, per: 'articol' },
  { id: 'products', name: 'Încărcare produse', unit: 10, per: 'produs' },
  { id: 'hour', name: 'Oră de lucru', unit: 150, per: 'oră' },
  { id: 'day', name: 'Zi de lucru', unit: 1000, per: 'zi' },
  { id: 'gbp', name: 'Google Business Profile', unit: 1200, per: 'buc.' },
  { id: 'emag', name: 'Integrare eMAG', unit: 3000, per: 'buc.' },
];

export const RESALE = [
  { name: 'Domeniu .ro', price: '60 RON / an' },
  { name: 'Domeniu .com', price: '80 RON / an' },
  { name: 'Găzduire site prezentare', price: '400 RON / an' },
  { name: 'Găzduire magazin / aplicație', price: '1.500–2.500 RON / an' },
  { name: 'Email profesional', price: '150 RON / an / cont' },
  { name: 'Google Workspace', price: 'licență + 15%, setup 250 RON' },
];

export const RULES = [
  'Prețuri fără TVA, în RON (1 EUR ≈ 5,10 RON).',
  'Plată 50% avans + 50% la lansare. Peste 15.000 RON: 40 / 30 / 30.',
  'Discount maxim 10%, doar în schimbul a ceva (mentenanță 12 luni, plată integrală, recomandare).',
  'Urgență (sub jumătate din termen): +25%.',
  'Plată anuală în avans la mentenanță: 5% reducere.',
];

export type ExtraLine = { id: string; qty: number };

/** Quote = package + extras, then urgency, then discount. */
export function quote(pkgId: string | null, base: number, extras: ExtraLine[], urgent: boolean, discountPct: number) {
  const pkg = packageById(pkgId);
  const start = base || pkg?.price || 0;
  let extra = 0;
  for (const line of extras) {
    const e = EXTRAS.find((x) => x.id === line.id);
    if (!e || !line.qty) continue;
    extra += e.unit ? e.unit * line.qty : ((e.pct ?? 0) / 100) * start * line.qty;
  }
  let total = start + extra;
  if (urgent) total *= 1.25;
  total *= 1 - Math.min(Math.max(discountPct, 0), 100) / 100;
  return Math.round(total / 10) * 10;
}

/** Payment installments suggested by the price list. */
export function installments(total: number): { label: string; pct: number }[] {
  if (total > 15000) return [{ label: 'Avans', pct: 40 }, { label: 'Design aprobat', pct: 30 }, { label: 'Lansare', pct: 30 }];
  return [{ label: 'Avans', pct: 50 }, { label: 'Lansare', pct: 50 }];
}

export const priceText = (p: Package) =>
  p.price === 0 ? 'manual' : `${p.from ? 'de la ' : ''}${fmt(p.price)}${p.max ? `–${fmt(p.max)}` : ''} RON`;
export const fmt = (n: number) => Math.round(n).toLocaleString('ro-RO');
