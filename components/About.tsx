import { site } from '@/site.config';
import { t, type Lang } from '@/lib/i18n';
import WhatsAppIcon from './WhatsAppIcon';
import Hero3D from './Hero3D';

export default function About({ lang }: { lang: Lang }) {
  const c = t[lang];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description: c.description,
    email: site.email,
    ...(site.whatsapp ? { telephone: `+${site.whatsapp}` } : {}),
    knowsLanguage: ['ro'],
  };

  const mail = `mailto:${site.email}`;
  return (
    <>
      <section className="wrap hero">
        <div className="hero-copy">
          <p className="kicker">{c.tagline}</p>
          <h1>{c.hero.h1a}<span>{c.hero.h1b}</span>.</h1>
          <p className="hero-lead">{c.hero.lead}</p>
          <div className="cta">
            <a className="gbtn gbtn-primary" href={mail}>{c.hero.start}</a>
            <a className="gbtn" href={`#${c.ids.services}`}>{c.hero.see}</a>
          </div>
        </div>
        <Hero3D />
      </section>

      <section className="wrap sec" id={c.ids.services}>
        <p className="kicker">{c.services.kicker}</p>
        <h2 className="h">{c.services.title}</h2>
        <div className="cards">
          {c.services.items.map((s, i) => (
            <article key={s.t} className="ncard">
              <div className={`cube cube-${i % 2 ? 'mag' : 'cy'}`} aria-hidden><i /><i /><i /><i /><i /></div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      {site.portfolio.length > 0 && (
        <section className="wrap sec" id="portfolio">
          <p className="kicker">{c.portfolio.kicker}</p>
          <h2 className="h">{c.portfolio.title}</h2>
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

      <section className="wrap sec" id={c.ids.process}>
        <p className="kicker">{c.process.kicker}</p>
        <h2 className="h">{c.process.title}</h2>
        <ol className="steps">
          {c.process.items.map((s, i) => (
            <li key={s.t}>
              <b className="step-n" aria-hidden>{i + 1}</b>
              <span><strong>{s.t}</strong>{s.d}</span>
              <span className="stack" aria-hidden>{Array.from({ length: i + 1 }, (_, k) => <i key={k} />)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap sec" id={c.ids.contact}>
        <div className="contact-panel">
          <div className="contact-px" aria-hidden><i /><i /></div>
          <div>
            <p className="kicker">{c.contact.kicker}</p>
            <h2 className="h">{c.contact.title}</h2>
            <p className="lede">{c.contact.lead}</p>
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
