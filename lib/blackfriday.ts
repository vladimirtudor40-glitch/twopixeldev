// Black Friday 2026 campaign: the two entry packages at -50%, from the client price list
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
    includes: ['Până la 5 pagini', 'SEO on-page, GDPR, ANPC SAL', 'Formular, hartă', '1 lună de mentenanță inclusă'] },
];
