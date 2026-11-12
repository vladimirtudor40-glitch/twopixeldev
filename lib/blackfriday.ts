// Black Friday 2026 campaign: every service at -50%, mirrored from the client price list
// (Preturi_twopixeldev_BlackFriday_2026.pdf). Standard prices are the ones in force before the
// campaign, i.e. the lowest price in the 30 days before it (Omnibus rule).

export const BF = {
  start: '2026-11-01T00:00:00+02:00',
  end: '2026-11-30T23:59:59+02:00',
  startLabel: '1 noiembrie 2026, ora 00:00',
  endLabel: '30 noiembrie 2026, ora 23:59',
  endShort: '30.11',
};

export const PFA = {
  name: 'TUDOR VLADIMIR PERSOANĂ FIZICĂ AUTORIZATĂ',
  cui: '55831473',
  orc: 'F2026049416004',
  euid: 'ROONRC.F2026049416004',
};

/** A price row. `std` is the standard price as written in the price list ("1.900", "12.000–25.000",
 *  "60 / 80"); `fixed` is a price that does not change (percentages, "licența + 15%"). */
export type Row = { name: string; note?: string; std?: string; from?: boolean; unit?: string; fixed?: string; term?: string };

const fmt = (n: number) => Math.round(n).toLocaleString('de-DE');
/** Halves every number in a price string, keeping separators: "12.000–25.000" -> "6.000–12.500". */
export const half = (s: string) => s.replace(/\d{1,3}(?:\.\d{3})*/g, (m) => fmt(Number(m.replace(/\./g, '')) / 2));

export type Pack = Row & { tag?: string; includes: string[] };

export const PACKS: Pack[] = [
  { name: 'Landing page', std: '1.900', term: '1 săptămână',
    includes: ['O pagină lungă, pe secțiuni', 'Formular sau buton WhatsApp', 'SEO de bază, GDPR', 'Perfect pentru o campanie'] },
  { name: 'Site Start', std: '3.200', term: '2 săptămâni',
    includes: ['Până la 5 pagini', 'SEO on-page, GDPR, ANPC SAL', 'Formular, hartă', '1 lună Basic inclusă'] },
  { name: 'Site Business', std: '6.500', term: '3–4 săptămâni', tag: 'cel mai ales',
    includes: ['6–10 pagini, design custom', 'Blog sau portofoliu', 'SEO tehnic, viteză', '1 lună Standard inclusă'] },
  { name: 'Site Premium', std: '12.500', from: true, term: '5–8 săptămâni',
    includes: ['Până la 15 pagini, animații', 'Română + engleză', 'O integrare, panou de administrare', '3 luni Standard incluse'] },
  { name: 'Magazin Start', std: '7.500', term: '3–4 săptămâni',
    includes: ['Până la 100 de produse', 'Card și ramburs, facturare', 'Curier, conformitate ANPC', '1 lună Magazin inclusă'] },
  { name: 'Magazin Pro', std: '13.500', term: '5–7 săptămâni',
    includes: ['Până la 2.000 de produse', 'Filtre, import, cupoane', 'AWB automat, Google Shopping', '1 lună Magazin inclusă'] },
];

export type Group = { id: string; title: string; rows: Row[] };

export const GROUPS: Group[] = [
  { id: 'magazine', title: 'Magazine avansate', rows: [
    { name: 'Magazin B2B', std: '22.000', from: true, note: 'conturi de distribuitor, prețuri pe client, sincronizare ERP' },
  ] },
  { id: 'aplicatii', title: 'Aplicații și software la comandă', rows: [
    { name: 'Specificație și estimare', std: '1.000', note: 'se scade din preț dacă semnăm proiectul' },
    { name: 'Aplicație web MVP', std: '12.000–25.000', note: 'conturi, 3–5 module, panou de administrare' },
    { name: 'Aplicație web medie', std: '25.000–60.000', note: 'portal de clienți, rezervări, roluri, plăți, integrări' },
    { name: 'Aplicație mobilă MVP', std: '18.000–35.000', note: 'iOS și Android, login, notificări, publicare în magazine' },
    { name: 'Aplicație mobilă completă', std: '35.000–80.000', note: 'plăți în aplicație, mod offline, panou web, statistici' },
    { name: 'Software intern', std: '15.000', from: true, note: 'CRM, gestiune, rapoarte, făcut pe fluxul firmei tale' },
  ] },
  { id: 'automatizari', title: 'Automatizări și integrări', rows: [
    { name: 'Automatizare simplă', std: '600–1.200', note: 'formular → email, Sheets, CRM sau WhatsApp' },
    { name: 'Integrare facturare sau curier', std: '1.500–3.000', note: 'facturi automate cu e-Factura, AWB automat' },
    { name: 'Integrare marketplace sau ERP', std: '3.000–6.000', note: 'produse, stocuri și comenzi sincronizate (ex. eMAG)' },
    { name: 'Chatbot sau asistent AI', std: '2.500–6.000', note: 'pe site sau WhatsApp; costul API-ului AI se facturează lunar' },
    { name: 'Flux de lucru complex', std: '4.000–10.000', note: 'mai multe sisteme legate: oferte, aprobări, rapoarte' },
    { name: 'Monitorizare automatizări', std: '100–250', unit: '/lună', note: 'serviciile externe își schimbă API-urile' },
  ] },
  { id: 'design', title: 'Design și branding', rows: [
    { name: 'Logo', std: '800–1.500', note: '3 propuneri, 2 runde, fișiere SVG, PNG și PDF' },
    { name: 'Identitate vizuală', std: '2.000–4.000', note: 'logo, culori, fonturi, ghid de brand, șabloane social media' },
    { name: 'Design UI pentru site (Figma)', std: '2.500–5.000', note: 'machete desktop și mobil, până la 8 pagini' },
    { name: 'Design UI/UX pentru aplicație', std: '4.000–12.000', note: 'fluxuri, wireframe-uri, machete, prototip clicabil' },
    { name: 'Audit UX', std: '1.200', note: 'probleme ordonate după impact, cu recomandări' },
    { name: 'Redesign site existent', fixed: '70% din pachetul nou, redus și el cu 50%', note: 'același conținut, design și cod noi' },
  ] },
  { id: 'gazduire', title: 'Domenii, găzduire și email', rows: [
    { name: 'Domeniu .ro / .com', std: '60 / 80', unit: '/an', note: 'pe numele tău' },
    { name: 'Găzduire site de prezentare', std: '400', unit: '/an', note: 'fără modificări incluse' },
    { name: 'Găzduire magazin sau aplicație', std: '1.500–2.500', unit: '/an', note: 'după trafic' },
    { name: 'Email profesional', std: '150', unit: '/an/cont', note: 'configurare inclusă' },
    { name: 'Configurare Google Workspace', std: '250', note: 'licența Google se plătește separat, + 15%' },
  ] },
  { id: 'extra', title: 'Servicii extra', rows: [
    { name: 'Oră de lucru', std: '150', note: 'modificări, consultanță' },
    { name: 'Zi de lucru (8 ore)', std: '1.000' },
    { name: 'Pagină suplimentară', std: '350' },
    { name: 'Texte pentru site', std: '150', unit: '/pagină' },
    { name: 'Articol de blog SEO', std: '250', note: '800–1.200 de cuvinte' },
    { name: 'SEO local și Google Business Profile', std: '1.200' },
    { name: 'Încărcare produse', std: '10', unit: '/produs' },
    { name: 'Configurare Google Ads sau Meta Ads', std: '800' },
    { name: 'Administrare reclame', std: '800–1.500', unit: '/lună', note: 'fără bugetul de reclame' },
    { name: 'Mutare site de la alt furnizor', std: '500–1.000' },
    { name: 'Reparare site spart sau virusat', std: '800', from: true },
    { name: 'Limbă suplimentară', fixed: '+30% din prețul site-ului' },
  ] },
];

export const PLANS: Row[] = [
  { name: 'Basic', std: '150', unit: '/lună', note: 'găzduire, SSL, domeniu, backup săptămânal, 30 min de modificări' },
  { name: 'Standard', std: '300', unit: '/lună', note: 'plus backup zilnic, monitorizare 24/7, 1,5 ore, raport lunar' },
  { name: 'Magazin', std: '650', unit: '/lună', note: 'plus 3 ore, verificarea plăților, facturilor și AWB-urilor' },
  { name: 'Aplicație (SLA)', std: '1.200', from: true, unit: '/lună', note: 'remediere bug-uri, 6 ore de dezvoltare, răspuns în aceeași zi' },
];
