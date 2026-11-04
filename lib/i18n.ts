// Public-site texts in Romanian and English. Romanian lives at /, English at /en/.
export type Lang = 'ro' | 'en';

export const paths = {
  ro: { home: '/', privacy: '/confidentialitate/', terms: '/termeni/' },
  en: { home: '/en/', privacy: '/en/privacy/', terms: '/en/terms/' },
} as const;

export const t = {
  ro: {
    title: 'twopixeldev: site-uri, aplicații și soluții IT la comandă',
    description:
      'twopixeldev este un studio de dezvoltare software condus de Vladimir și Evelina. Construim site-uri, aplicații web și mobile și soluții IT la comandă, de la idee până la lansare și mentenanță.',
    ogLocale: 'ro_RO',
    tagline: '[ SITE-URI // APLICAȚII // SOLUȚII IT ]',
    ids: { services: 'servicii', process: 'cum-lucram', contact: 'contact' },
    nav: { services: 'Servicii', process: 'Cum lucrăm', contact: 'Contact', write: 'Scrie-ne', main: 'Principal', waLabel: 'Scrie-ne pe WhatsApp', switchTo: 'English', switchLabel: 'Switch to English' },
    theme: { toLight: 'Comută pe tema deschisă', toDark: 'Comută pe tema întunecată', light: 'Temă deschisă', dark: 'Temă întunecată' },
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
  en: {
    title: 'twopixeldev: websites, apps and custom IT solutions',
    description:
      'twopixeldev is a software development studio run by Vladimir and Evelina. We build websites, web and mobile apps and custom IT solutions, from the first idea through launch and maintenance.',
    ogLocale: 'en_US',
    tagline: '[ WEBSITES // APPS // IT SOLUTIONS ]',
    ids: { services: 'services', process: 'how-we-work', contact: 'contact' },
    nav: { services: 'Services', process: 'How we work', contact: 'Contact', write: 'Contact us', main: 'Main', waLabel: 'Message us on WhatsApp', switchTo: 'Română', switchLabel: 'Schimbă în română' },
    theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme', light: 'Light theme', dark: 'Dark theme' },
    hero: {
      h1a: 'Websites, apps and IT solutions, built ',
      h1b: 'pixel by pixel',
      lead: 'We are Vladimir and Evelina, the founders of twopixeldev. We turn ideas into digital products, from a company website to a full application or an internal system for your business. You work directly with us, from the first call until well after launch.',
      start: 'Start a project',
      see: 'See our services',
    },
    services: {
      kicker: 'services',
      title: 'What we do',
      items: [
        { t: 'Websites', d: 'Company websites, online stores and fast landing pages that are easy to manage and designed mobile-first.' },
        { t: 'Web and mobile apps', d: 'Online platforms, client portals and iOS and Android apps, built on modern technology that grows with your business.' },
        { t: 'Custom software', d: 'Admin dashboards, CRMs, booking and management systems, shaped around the way your team actually works.' },
        { t: 'Automation and integrations', d: 'We connect the tools you already use, from payments and email to calendars and accounting, and automate repetitive work.' },
        { t: 'UI/UX design', d: 'Clear interfaces that fit your brand, from the first sketch to a clickable prototype you can test before development.' },
        { t: 'Infrastructure and maintenance', d: 'Domain, hosting, business email, security and backups. After launch we look after the technical side so you can focus on your business.' },
      ],
    },
    portfolio: { kicker: 'portfolio', title: 'Projects' },
    process: {
      kicker: 'how we work',
      title: 'From idea to launch',
      items: [
        { t: 'Discovery', d: 'You tell us what you want to solve. Together we pin down goals, budget and timeline.' },
        { t: 'Proposal', d: 'You get a clear offer with the project stages, the cost and exactly what you receive at the end.' },
        { t: 'Development', d: 'We work in short iterations and show you progress along the way, so you can give feedback early.' },
        { t: 'Launch and support', d: 'We go live, show you how everything works and stay on hand for updates and improvements.' },
      ],
    },
    contact: {
      kicker: 'contact',
      title: 'Have a project in mind?',
      lead: 'Tell us briefly what you want to build. We reply within one business day with the next steps. We work in English and Romanian.',
    },
    footer: { home: 'Home', privacy: 'Privacy', terms: 'Terms', legal: 'Legal' },
    legal: { updated: 'Last updated' },
    cookies: {
      label: 'Cookie notice',
      text: 'We only use cookies that are strictly necessary for security and for the site to work. No ads, no analytics, no tracking.',
      more: 'Details',
      ok: 'Got it',
    },
  },
};
