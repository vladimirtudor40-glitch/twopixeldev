// Data for the public template simulator (/simulator/): business types, locations and the
// 5 template styles per type. Templates are static pages in public/sabloane/<type>/<style>/,
// each with 3 content sets (mare, munte, oras) that switch via ?loc= or postMessage.
// Prices come from lib/pricing.ts, so they follow the internal price list.

import { EXTRAS, packageById, planById, fmt } from './pricing';

export type LocId = 'mare' | 'munte' | 'oras';

export const LOCATIONS: { id: LocId; label: string }[] = [
  { id: 'mare', label: 'La mare' },
  { id: 'munte', label: 'La munte' },
  { id: 'oras', label: 'În oraș' },
];

export type Style = {
  id: string;
  name: string;
  /** One line on the look. */
  look: string;
  /** Who it suits best. */
  fits: string;
  features: string[];
  /** Brand swatches shown on the style card. */
  colors: string[];
  /** Package from the price list, plus optional extra languages (30% each). */
  pkg: string;
  extraLangs?: number;
  /** Fictional business shown in each location, used for the fake address bar. */
  demo: Record<LocId, { name: string; domain: string }>;
};

export type Sector = {
  id: string;
  label: string;
  examples: string;
  /** False = shown as "în curând". */
  ready: boolean;
  styles: Style[];
};

const HOTEL_STYLES: Style[] = [
  {
    id: 'luminos',
    name: 'Luminos',
    look: 'Luminos și aerisit, cu poze mari și mult spațiu alb.',
    fits: 'Hoteluri boutique de 3–4 stele',
    features: ['Rezervare în 4 pași, cu preț calculat pe loc', 'Camere cu filtru după persoane', 'Oferte, galerie și recenzii', 'Site în română și engleză'],
    colors: ['#F4EDE1', '#1E7FB8', '#FF7A59'],
    pkg: 'site-business',
    extraLangs: 1,
    demo: {
      mare: { name: 'Hotel Marea Albastră', domain: 'hotelmareaalbastra.ro' },
      munte: { name: 'Hotel Brad Alb', domain: 'hotelbradalb.ro' },
      oras: { name: 'Hotel Lumen', domain: 'hotellumen.ro' },
    },
  },
  {
    id: 'rustic',
    name: 'Rustic',
    look: 'Cald și primitor, ca o casă de familie renovată cu gust.',
    fits: 'Pensiuni și case de oaspeți',
    features: ['Povestea gazdelor, pe prima pagină', 'Calendar de disponibilitate pe 2 luni', 'Cerere de rezervare cu preț estimativ', 'Pachete de sezon și sărbători'],
    colors: ['#F6F0E6', '#8B5E3C', '#2F4A3A', '#D9822B'],
    pkg: 'site-business',
    demo: {
      mare: { name: 'Casa Pescarului', domain: 'casapescarului.ro' },
      munte: { name: 'Pensiunea Dor de Munte', domain: 'dordemunte.ro' },
      oras: { name: 'Casa cu Cerdac', domain: 'casacucerdac.ro' },
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    look: 'Lux discret, întunecat și cinematografic, cu accente aurii.',
    fits: 'Hoteluri de 5 stele, resorturi cu spa',
    features: ['Calendar de rezervare cu preț pe fiecare zi', 'Rezervări la restaurant și spa', 'Cereri de ofertă pentru evenimente', 'Site în română și engleză'],
    colors: ['#0E0D0B', '#EFE6D8', '#B8945A'],
    pkg: 'site-premium',
    demo: {
      mare: { name: 'Aurum Grand Hotel & Spa', domain: 'aurumgrand.ro' },
      munte: { name: 'Aurum Alpine Resort & Spa', domain: 'aurumalpine.ro' },
      oras: { name: 'Aurum Palace Hotel', domain: 'aurumpalace.ro' },
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    look: 'Modern și practic, rapid ca o aplicație.',
    fits: 'Apartamente în regim hotelier, aparthoteluri',
    features: ['Filtre pe zonă, camere, preț și dotări', 'Hartă cu apartamentele', 'Pagină pentru fiecare apartament, cu calendar', 'Calculator de venit pentru proprietari'],
    colors: ['#F2F1EE', '#1C1C1E', '#2BB673'],
    pkg: 'site-business',
    demo: {
      mare: { name: 'Urban Stay Mamaia', domain: 'urbanstay-mamaia.ro' },
      munte: { name: 'Urban Stay Brașov', domain: 'urbanstay-brasov.ro' },
      oras: { name: 'Urban Stay Constanța', domain: 'urbanstay-constanta.ro' },
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    look: 'Colorat și îndrăzneț, totul pe o singură pagină.',
    fits: 'Glamping, vile și cazări mici',
    features: ['O singură pagină, gata în câteva zile', 'Cazări, „o zi la noi” și galerie', 'Rezervare scurtă cu preț calculat', 'Buton de rezervare mereu la îndemână'],
    colors: ['#FFF8EC', '#FFC93C', '#13B6B0', '#FF6B8B'],
    pkg: 'landing',
    demo: {
      mare: { name: 'Glamping Soare & Sare', domain: 'soaresisare.ro' },
      munte: { name: 'Glamping Nori & Brazi', domain: 'norisibrazi.ro' },
      oras: { name: 'Vila Mozaic', domain: 'vilamozaic.ro' },
    },
  },
];

export const SECTORS: Sector[] = [
  { id: 'hoteluri', label: 'Hoteluri și pensiuni', examples: 'hoteluri, pensiuni, apartamente, glamping', ready: true, styles: HOTEL_STYLES },
  { id: 'frizerii', label: 'Frizerii și saloane', examples: 'barber shop, salon, cosmetică, unghii', ready: false, styles: [] },
  { id: 'restaurante', label: 'Restaurante și cafenele', examples: 'restaurant, pizzerie, patiserie, catering', ready: false, styles: [] },
  { id: 'constructii', label: 'Construcții și amenajări', examples: 'construcții, instalații, tâmplărie, renovări', ready: false, styles: [] },
  { id: 'magazine', label: 'Magazine online', examples: 'haine, cosmetice, produse locale', ready: false, styles: [] },
  { id: 'sanatate', label: 'Sănătate', examples: 'stomatologie, clinici, kinetoterapie', ready: false, styles: [] },
];

export const templateUrl = (sector: string, style: string, loc: LocId) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/sabloane/${sector}/${style}/index.html?loc=${loc}&embed=1`;

/** Price text for a style, from the price list ("de la 12.500 RON", "≈ 8.450 RON"). */
export function stylePrice(s: Style) {
  const p = packageById(s.pkg);
  if (!p) return { price: '', name: '', term: '', monthly: '' };
  const langPct = EXTRAS.find((e) => e.id === 'lang')?.pct ?? 0;
  const total = Math.round((p.price * (1 + ((s.extraLangs ?? 0) * langPct) / 100)) / 10) * 10;
  const prefix = p.from ? 'de la ' : s.extraLangs ? '≈ ' : '';
  const plan = planById(p.plan);
  return {
    price: `${prefix}${fmt(total)} RON`,
    name: s.extraLangs ? `${p.name} + engleză` : p.name,
    term: p.term ?? '',
    monthly: plan ? `mentenanță ${plan.name}, ${fmt(plan.monthly)} RON / lună` : '',
  };
}
