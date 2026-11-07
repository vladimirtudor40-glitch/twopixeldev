// "Ce site ți se potrivește?" questionnaire on the public home page: 4 short questions that
// recommend one of 5 site templates. Each answer adds points to one or more templates; the
// template with the most points wins (ties go to the one listed first in `templates`).

export type TemplateId = 'restaurant' | 'salon' | 'shop' | 'firm' | 'portfolio';

export type Template = {
  id: TemplateId;
  name: string;      // template name, shown in the gallery
  genre: string;     // who it is for
  pitch: string;     // one sentence on what it does
  features: string[];
  from: string;      // short "what you get" line under the features
};

export const templates: Template[] = [
  {
    id: 'restaurant',
    name: 'Gust',
    genre: 'Restaurant, cafenea, patiserie',
    pitch: 'Un site cald, cu poze care fac poftă, meniul mereu la zi și rezervări din două atingeri.',
    features: ['Meniu cu prețuri, ușor de actualizat', 'Rezervare masă sau comandă rapidă', 'Galerie foto, program și hartă', 'Legături spre Glovo, Tazz sau Bolt Food'],
    from: 'Ideal pentru localuri care vor mai multe rezervări și comenzi directe.',
  },
  {
    id: 'salon',
    name: 'Stil',
    genre: 'Frizerie, salon, cosmetică, fitness',
    pitch: 'Un site elegant care își face singur programările: clientul alege serviciul, omul și ora.',
    features: ['Programări online, fără telefoane', 'Servicii și prețuri pe categorii', 'Echipa, cu poze și specializări', 'Galerie cu lucrări și recenzii'],
    from: 'Ideal pentru saloane care vor agenda plină și mai puțin timp la telefon.',
  },
  {
    id: 'shop',
    name: 'Vitrina',
    genre: 'Magazin online',
    pitch: 'Un magazin rapid, gândit pentru telefon, cu plată cu cardul și livrare prin curier.',
    features: ['Catalog cu filtre și căutare', 'Coș, plată cu cardul sau ramburs', 'Livrare prin curier, cu AWB automat', 'Panou simplu pentru produse și stocuri'],
    from: 'Ideal pentru cine vinde produse și vrea comenzi și noaptea, nu doar în program.',
  },
  {
    id: 'firm',
    name: 'Pro',
    genre: 'Firmă, servicii, construcții, consultanță',
    pitch: 'Un site sobru care inspiră încredere și transformă vizitatorii în cereri de ofertă.',
    features: ['Pagini clare pentru fiecare serviciu', 'Formular de cerere ofertă', 'Proiecte realizate și recenzii', 'Optimizat pentru Google, pe orașul tău'],
    from: 'Ideal pentru firme care vor clienți noi din căutările de pe Google.',
  },
  {
    id: 'portfolio',
    name: 'Studio',
    genre: 'Portofoliu personal, freelancer, artist',
    pitch: 'Un site minimal în care lucrările tale vorbesc primele, cu un drum scurt până la contact.',
    features: ['Galerie de proiecte pe categorii', 'Pagină „despre mine” și CV', 'Formular de contact sau colaborare', 'Domeniu propriu, de ex. numele-tau.ro'],
    from: 'Ideal pentru fotografi, designeri, artiști și oricine își vinde talentul.',
  },
];

export type Answer = { label: string; score?: Partial<Record<TemplateId, number>> };
export type Question = { id: string; q: string; hint?: string; answers: Answer[] };

export const questions: Question[] = [
  {
    id: 'business',
    q: 'Ce fel de afacere ai?',
    answers: [
      { label: 'Restaurant, cafenea sau patiserie', score: { restaurant: 4 } },
      { label: 'Frizerie, salon sau cosmetică', score: { salon: 4 } },
      { label: 'Vând produse', score: { shop: 4 } },
      { label: 'Firmă de servicii', score: { firm: 4 } },
      { label: 'Freelancer, artist sau creator', score: { portfolio: 4 } },
      { label: 'Altceva', score: { firm: 1 } },
    ],
  },
  {
    id: 'goal',
    q: 'Ce vrei să facă site-ul în primul rând?',
    answers: [
      { label: 'Să vândă online', score: { shop: 3 } },
      { label: 'Să primesc programări sau rezervări', score: { salon: 2, restaurant: 1 } },
      { label: 'Să-mi arate meniul, programul și locația', score: { restaurant: 2, salon: 1 } },
      { label: 'Să primesc cereri de ofertă', score: { firm: 3 } },
      { label: 'Să-mi arate lucrările', score: { portfolio: 3, salon: 1 } },
    ],
  },
  {
    id: 'style',
    q: 'Ce stil ți se potrivește?',
    answers: [
      { label: 'Cald și primitor', score: { restaurant: 2 } },
      { label: 'Elegant și modern', score: { salon: 2, portfolio: 1 } },
      { label: 'Curat și comercial', score: { shop: 2 } },
      { label: 'Sobru și profesionist', score: { firm: 2 } },
      { label: 'Minimal și creativ', score: { portfolio: 2 } },
    ],
  },
  {
    id: 'when',
    q: 'Când ai vrea să fie gata?',
    hint: 'Nu schimbă recomandarea, ne ajută doar să-ți facem o ofertă realistă.',
    answers: [
      { label: 'Cât mai repede' },
      { label: 'În 1–2 luni' },
      { label: 'Nu mă grăbesc' },
      { label: 'Încă mă gândesc' },
    ],
  },
];

/** Picks the template with the highest score for the given answer indexes. */
export function recommend(picks: number[]): TemplateId {
  const total: Record<TemplateId, number> = { restaurant: 0, salon: 0, shop: 0, firm: 0, portfolio: 0 };
  picks.forEach((a, qi) => {
    const s = questions[qi]?.answers[a]?.score ?? {};
    for (const [id, n] of Object.entries(s)) total[id as TemplateId] += n ?? 0;
  });
  let best = templates[0].id;
  for (const tpl of templates) if (total[tpl.id] > total[best]) best = tpl.id;
  return best;
}
