// Public-site texts. The site is Romanian only.
export type Lang = 'ro';

export const paths = {
  ro: { home: '/', privacy: '/confidentialitate/', terms: '/termeni/', simulator: '/simulator/' },
} as const;

export const t = {
  ro: {
    title: 'twopixeldev: site-uri, aplicații și soluții IT la comandă',
    description:
      'twopixeldev este un studio de dezvoltare software condus de Vladimir și Evelina. Construim site-uri, aplicații web și mobile și soluții IT la comandă, de la idee până la lansare și mentenanță.',
    ogLocale: 'ro_RO',
    tagline: 'site-uri · aplicații · soluții IT',
    ids: { services: 'servicii', process: 'cum-lucram', contact: 'contact' },
    nav: { simulator: 'Simulator', services: 'Servicii', process: 'Cum lucrăm', contact: 'Contact', write: 'Scrie-ne', main: 'Principal', waLabel: 'Scrie-ne pe WhatsApp' },
    hero: {
      h1a: 'Site-uri, aplicații și soluții IT, construite ',
      h1b: 'pixel cu pixel',
      lead: 'Suntem Vladimir și Evelina, fondatorii twopixeldev. Transformăm ideile în produse digitale, de la un site de prezentare la o aplicație completă sau un sistem intern pentru firma ta. Lucrezi direct cu noi, de la prima discuție până după lansare.',
      start: 'Începe un proiect',
      see: 'Vezi serviciile',
    },
    services: {
      kicker: 'servicii',
      title: 'Ce facem',
      items: [
        { t: 'Site-uri web', d: 'Site-uri de prezentare, magazine online și landing page-uri rapide, ușor de administrat și gândite întâi pentru telefon.' },
        { t: 'Aplicații web și mobile', d: 'Platforme online, portaluri pentru clienți și aplicații pentru iOS și Android, construite pe tehnologii moderne care cresc odată cu afacerea ta.' },
        { t: 'Software la comandă', d: 'Panouri de administrare, CRM-uri, sisteme de rezervări sau de gestiune, făcute exact după felul în care lucrează echipa ta.' },
        { t: 'Automatizări și integrări', d: 'Conectăm aplicațiile pe care le folosești deja, de la plăți și email la calendar și contabilitate, și automatizăm sarcinile repetitive.' },
        { t: 'Design UI/UX', d: 'Interfețe clare, coerente cu brandul tău, de la schița inițială până la prototipul pe care îl poți testa înainte de dezvoltare.' },
        { t: 'Infrastructură și mentenanță', d: 'Domeniu, găzduire, email profesional, securitate și backup. După lansare ne ocupăm noi de partea tehnică, ca tu să te poți ocupa de afacere.' },
      ],
    },
    sim: {
      kicker: 'simulator',
      title: 'Vezi site-ul înainte să-l comanzi',
      lead: 'Alege domeniul afacerii și locul unde lucrezi, apoi răsfoiește cinci stiluri de site, live, pe calculator și pe telefon, cu prețul fiecăruia. Începem cu hoteluri și pensiuni, urmează frizeriile și restaurantele.',
      cta: 'Deschide simulatorul',
    },
    portfolio: { kicker: 'portofoliu', title: 'Proiecte' },
    process: {
      kicker: 'cum lucrăm',
      title: 'De la idee la lansare',
      items: [
        { t: 'Discuție', d: 'Ne spui ce vrei să rezolvi. Clarificăm împreună obiectivele, bugetul și termenul.' },
        { t: 'Propunere', d: 'Primești o ofertă clară, cu etapele proiectului, costul și tot ce primești la final.' },
        { t: 'Dezvoltare', d: 'Lucrăm în etape scurte și îți arătăm progresul pe parcurs, ca să poți da feedback din timp.' },
        { t: 'Lansare și suport', d: 'Publicăm proiectul, îți arătăm cum se folosește și rămânem alături pentru actualizări și îmbunătățiri.' },
      ],
    },
    contact: {
      kicker: 'contact',
      title: 'Ai un proiect în minte?',
      lead: 'Spune-ne pe scurt ce vrei să construiești. Îți răspundem în cel mult o zi lucrătoare cu pașii următori.',
    },
    footer: { home: 'Acasă', privacy: 'Confidențialitate', terms: 'Termeni', legal: 'Legal' },
    legal: { updated: 'Ultima actualizare' },
    cookies: {
      label: 'Informare cookie-uri',
      text: 'Folosim doar cookie-uri strict necesare pentru securitatea și funcționarea site-ului. Fără reclame, fără analiză, fără urmărire.',
      more: 'Detalii',
      ok: 'Am înțeles',
    },
  },
};
