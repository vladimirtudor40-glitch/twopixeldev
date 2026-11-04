import { site } from '@/site.config';
import WhatsAppIcon from './WhatsAppIcon';

const services = [
  { t: 'Site-uri web', d: 'Site-uri de prezentare, magazine online și landing page-uri rapide, ușor de administrat și gândite întâi pentru telefon.' },
  { t: 'Aplicații web și mobile', d: 'Platforme online, portaluri pentru clienți și aplicații pentru iOS și Android, construite pe tehnologii moderne care cresc odată cu afacerea ta.' },
  { t: 'Software la comandă', d: 'Panouri de administrare, CRM-uri, sisteme de rezervări sau de gestiune, făcute exact după felul în care lucrează echipa ta.' },
  { t: 'Automatizări și integrări', d: 'Conectăm aplicațiile pe care le folosești deja, de la plăți și email la calendar și contabilitate, și automatizăm sarcinile repetitive.' },
  { t: 'Design UI/UX', d: 'Interfețe clare, coerente cu brandul tău, de la schița inițială până la prototipul pe care îl poți testa înainte de dezvoltare.' },
  { t: 'Infrastructură și mentenanță', d: 'Domeniu, găzduire, email profesional, securitate și backup. După lansare ne ocupăm noi de partea tehnică, ca tu să te poți ocupa de afacere.' },
];

const steps = [
  { t: 'Discuție', d: 'Ne spui ce vrei să rezolvi. Clarificăm împreună obiectivele, bugetul și termenul.' },
  { t: 'Propunere', d: 'Primești o ofertă clară, cu etapele proiectului, costul și tot ce primești la final.' },
  { t: 'Dezvoltare', d: 'Lucrăm în etape scurte și îți arătăm progresul pe parcurs, ca să poți da feedback din timp.' },
  { t: 'Lansare și suport', d: 'Publicăm proiectul, îți arătăm cum se folosește și rămânem alături pentru actualizări și îmbunătățiri.' },
];

export default function About() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    ...(site.whatsapp ? { telephone: `+${site.whatsapp}` } : {}),
    founder: site.contacts.map((c) => ({ '@type': 'Person', name: c.name, email: c.email })),
    areaServed: 'RO',
  };

  const mail = `mailto:${site.email}`;
  return (
    <>
      <section className="wrap hero-copy">
        <h1>Site-uri, aplicații și soluții IT, construite <span>pixel cu pixel</span>.</h1>
        <div className="hero-side">
          <p>
            Suntem Vladimir și Evelina, fondatorii twopixeldev. Transformăm ideile în produse digitale, de la un site de
            prezentare la o aplicație completă sau un sistem intern pentru firma ta. Lucrezi direct cu noi, de la prima
            discuție până după lansare.
          </p>
          <div className="cta">
            <a className="gbtn gbtn-primary" href={mail}>Începe un proiect</a>
            <a className="gbtn" href="#servicii">Vezi serviciile</a>
          </div>
        </div>
      </section>

      <section className="wrap sec" id="servicii">
        <p className="kicker">servicii</p>
        <h2 className="h">Ce facem</h2>
        <div className="cards">
          {services.map((s, i) => (
            <article key={s.t} className="ncard">
              <div className="ico" aria-hidden>{String(i + 1).padStart(2, '0')}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      {site.portfolio.length > 0 && (
        <section className="wrap sec" id="portofoliu">
          <p className="kicker">portofoliu</p>
          <h2 className="h">Proiecte</h2>
          <div className="cards">
            {site.portfolio.map((p) => (
              <a key={p.url} className="ncard" href={p.url} target="_blank" rel="noopener">
                <h3>{p.name}</h3>
                <p>{p.note}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="wrap sec" id="cum-lucram">
        <p className="kicker">cum lucrăm</p>
        <h2 className="h">De la idee la lansare</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.t}><b>{i + 1}</b><span><strong>{s.t}</strong>{s.d}</span></li>
          ))}
        </ol>
      </section>

      <section className="wrap sec" id="contact">
        <div className="contact-panel">
          <div>
            <p className="kicker">contact</p>
            <h2 className="h">Ai un proiect în minte?</h2>
            <p className="lede">
              Spune-ne pe scurt ce vrei să construiești. Îți răspundem în cel mult o zi lucrătoare cu pașii următori.
            </p>
          </div>
          <div className="cta">
            <a className="gbtn gbtn-primary" href={mail}>{site.email}</a>
            {site.whatsapp && (
              <a className="gbtn gbtn-wa" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
                <WhatsAppIcon /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
