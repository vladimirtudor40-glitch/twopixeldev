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

  return (
    <div className="about">
      <section className="wrap sec" id="despre">
        <p className="kicker">[ despre noi ]</p>
        <h2>Site-uri web făcute cu atenție, pixel cu pixel.</h2>
        <p className="lede">
          twopixeldev este un studio mic de web development condus de Vladimir și Evelina.
          Facem site-uri rapide și clare pentru afaceri locale și le ținem la zi după lansare.
          Vorbești direct cu oamenii care construiesc site-ul.
        </p>
      </section>

      <section className="wrap sec" id="servicii">
        <p className="kicker">[ servicii ]</p>
        <h2>Ce facem</h2>
        <div className="cards">
          {services.map((s) => (
            <article key={s.t} className="card">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      {site.portfolio.length > 0 && (
        <section className="wrap sec" id="portofoliu">
          <p className="kicker">[ portofoliu ]</p>
          <h2>Proiecte</h2>
          <div className="cards">
            {site.portfolio.map((p) => (
              <a key={p.url} className="card card-link" href={p.url} target="_blank" rel="noopener">
                <h3>{p.name}</h3>
                <p>{p.note}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="wrap sec" id="cum-lucram">
        <p className="kicker">[ cum lucrăm ]</p>
        <h2>Trei pași</h2>
        <ol className="steps">
          {steps.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </section>

      <section className="wrap sec" id="contact">
        <p className="kicker">[ contact ]</p>
        <h2>Hai să vorbim</h2>
        <p className="lede">Scrie-ne un email și îți răspundem în cel mult o zi lucrătoare.</p>
        <div className="contacts">
          {site.contacts.map((c) => (
            <a key={c.email} className="contact" href={`mailto:${c.email}`}>
              <span>{c.name}</span>
              <strong>{c.email}</strong>
            </a>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
