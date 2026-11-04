import { site } from '@/site.config';

const services = [
  { t: 'Site-uri de prezentare', d: 'Pentru frizerii, saloane, pensiuni, restaurante și alte afaceri locale. Program, prețuri, galerie, hartă și buton de sunat, totul gândit întâi pentru telefon.' },
  { t: 'Domeniu, găzduire, email', d: 'Ne ocupăm de domeniu, DNS, certificat SSL și adrese de email pe domeniul tău, ca să nu-ți mai faci griji de reînnoiri.' },
  { t: 'Întreținere', d: 'Actualizăm meniul, prețurile sau pozele când ne scrii și urmărim ca site-ul să rămână rapid și online.' },
  { t: 'Vizibilitate pe Google', d: 'Structură corectă pentru motoarele de căutare, profil Google Business și pagini care se încarcă repede.' },
];

const steps = [
  'Ne scrii pe email ce afacere ai și ce vrei să afle clienții tăi.',
  'Îți arătăm o primă variantă a site-ului și o ajustăm împreună.',
  'Îl publicăm pe domeniul tău și rămânem la un email distanță pentru modificări.',
];

export default function About() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contacts[0].email,
    founder: site.contacts.map((c) => ({ '@type': 'Person', name: c.name, email: c.email })),
    areaServed: 'RO',
  };

  const mail = `mailto:${site.contacts[0].email}`;
  return (
    <>
      <section className="wrap hero-copy">
        <h1>Site-uri web pentru afaceri locale, făcute <span>pixel cu pixel</span>.</h1>
        <div className="hero-side">
          <p>
            Suntem Vladimir și Evelina, un studio mic de web development. Facem site-uri rapide și clare și le ținem
            la zi după lansare. Vorbești direct cu oamenii care construiesc site-ul.
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
        <h2 className="h">Trei pași</h2>
        <ol className="steps">
          {steps.map((s, i) => <li key={s}><b>{i + 1}</b><span>{s}</span></li>)}
        </ol>
      </section>

      <section className="wrap sec" id="contact">
        <div className="contact-panel">
          <div>
            <p className="kicker">contact</p>
            <h2 className="h">Hai să vorbim</h2>
            <p className="lede">Scrie-ne un email și îți răspundem în cel mult o zi lucrătoare.</p>
          </div>
          <div className="cta">
            {site.contacts.map((c, i) => (
              <a key={c.email} className={`gbtn ${i === 0 ? 'gbtn-primary' : 'gbtn-teal'}`} href={`mailto:${c.email}`}>
                {c.email}
              </a>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
