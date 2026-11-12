import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { site } from '@/site.config';
import { BF, PFA, PACKS, GROUPS, PLANS, half, type Row } from '@/lib/blackfriday';
import TornBand from '@/components/bf/TornBand';
import Countdown from '@/components/bf/Countdown';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import '../blackfriday.css';

const title = 'Black Friday −50% la toate serviciile | twopixeldev';
const description =
  'Black Friday twopixeldev: toată luna noiembrie 2026, site-uri, magazine online, aplicații, automatizări și design la jumătate de preț. Abonamentele au 50% reducere în primele 12 luni.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/black-friday/' },
  openGraph: { type: 'website', locale: 'ro_RO', url: `${site.url}/black-friday/`, siteName: site.name, title, description },
};

export const viewport: Viewport = { themeColor: '#0b0b0e' };

const wa = site.whatsapp
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Salut! Vreau o ofertă Black Friday (−50%) pentru: ')}`
  : '';
const mail = `mailto:${site.email}?subject=${encodeURIComponent('Ofertă Black Friday −50%')}`;

function Price({ r, big }: { r: Row; big?: boolean }) {
  if (r.fixed) return <span className="bf-fixed">{r.fixed}</span>;
  const from = r.from ? 'de la ' : '';
  return (
    <span className={big ? 'bf-price bf-price-big' : 'bf-price'}>
      <s aria-label={`preț standard ${from}${r.std} lei`}>{from}{r.std} lei</s>
      <b>
        {from}{half(r.std!)} lei{r.unit && <small>{r.unit}</small>}
      </b>
    </span>
  );
}

function Kicker({ a, b }: { a: string; b: string }) {
  return <p className="bf-kicker">[ {a} // {b} ]</p>;
}

function Ctas() {
  return (
    <div className="bf-cta">
      {wa && (
        <a className="bf-btn bf-btn-pink" href={wa} target="_blank" rel="noopener">
          <WhatsAppIcon /> Cere oferta pe WhatsApp
        </a>
      )}
      <a className="bf-btn" href={mail}>Scrie-ne pe email</a>
    </div>
  );
}

const FAQ = [
  ['Trebuie să fie gata proiectul până pe 30 noiembrie?',
    'Nu. Reducerea se aplică dacă semnezi contractul și plătești avansul până pe 30 noiembrie, ora 23:59. Lucrul poate începe și în decembrie sau mai târziu, după cum stabilim împreună.'],
  ['Cât e avansul?',
    'De regulă 50% la semnare și 50% la lansare. La proiectele de peste 15.000 lei, plata se împarte în 40% / 30% / 30%. Avansul se calculează din prețul redus.'],
  ['Reducerea e la orice serviciu?',
    'Da: pachete de site și magazin, aplicații, automatizări, design, găzduire, abonamente și servicii extra. Toate prețurile din listă sunt înjumătățite.'],
  ['Ce se întâmplă cu abonamentul după 12 luni?',
    'Abonamentul de mentenanță are 50% reducere în primele 12 luni. Din luna a 13-a revine la prețul standard și îl poți opri oricând, cu preaviz.'],
  ['Se cumulează cu alte reduceri?',
    'Nu. Reducerea de Black Friday nu se cumulează cu alte reduceri sau oferte, inclusiv cu reducerea de 5% la plata anuală în avans.'],
  ['Am nevoie de ceva ce nu e în listă.',
    'Scrie-ne. Îți facem o ofertă pe proiectul tău, iar dacă semnezi în perioada campaniei, primești tot 50% reducere.'],
];

export default function BlackFriday() {
  return (
    <div className="bfp">
      <header className="bf-wrap bf-nav">
        <Link className="bf-brand" href="/" aria-label="twopixeldev, acasă">
          <span className="bf-px" aria-hidden><i /><i /></span>
          <span>two<em>pixel</em>dev</span>
        </Link>
        <nav className="bf-nav-end">
          <a href="#pachete">Prețuri</a>
          <a href="#conditii">Condiții</a>
          <Link href="/">Site</Link>
        </nav>
      </header>

      <main>
        {/* hero: the poster */}
        <section className="bf-hero">
          <div className="bf-hero-px" aria-hidden><i /><i /></div>
          <TornBand seed={11}>
            <p className="bf-spaced">ofertă specială</p>
            <h1 className="bf-title">
              <span>Black</span> <span>Friday</span>
              <span className="sr-only"> la twopixeldev: 50% reducere la toate serviciile</span>
            </h1>
            <p className="bf-spaced">50% reducere</p>
          </TornBand>
          <div className="bf-wrap bf-hero-copy">
            <p className="bf-lead">
              Toată luna noiembrie, <strong>totul la jumătate de preț</strong>: site, magazin online, aplicație,
              automatizare sau design. Semnezi și plătești avansul până pe {BF.endShort}, iar noi putem începe și după.
            </p>
            <Countdown />
            <Ctas />
          </div>
        </section>

        {/* packages */}
        <section className="bf-wrap bf-sec" id="pachete">
          <Kicker a="pachete" b="−50%" />
          <h2 className="bf-h">Site-uri și magazine, la jumătate</h2>
          <div className="bf-cards">
            {PACKS.map((p) => (
              <article key={p.name} className={`bf-card${p.tag ? ' is-top' : ''}`}>
                <div className="bf-card-top">
                  <span className="bf-off">−50%</span>
                  {p.tag && <span className="bf-tag">{p.tag}</span>}
                </div>
                <h3>{p.name}</h3>
                <Price r={p} big />
                <ul>{p.includes.map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="bf-term">Termen: {p.term}</p>
              </article>
            ))}
          </div>
        </section>

        {/* subscriptions */}
        <section className="bf-wrap bf-sec" id="abonamente">
          <Kicker a="abonamente" b="12 luni la jumătate" />
          <h2 className="bf-h">Mentenanță: −50% în primele 12 luni</h2>
          <p className="bf-sub">După primele 12 luni, abonamentul revine la prețul standard.</p>
          <div className="bf-plans">
            {PLANS.map((p) => (
              <article key={p.name} className="bf-plan">
                <h3>{p.name}</h3>
                <Price r={p} />
                <p>{p.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* everything else */}
        <section className="bf-wrap bf-sec" id="servicii">
          <Kicker a="toate serviciile" b="−50%" />
          <h2 className="bf-h">Și tot restul, la jumătate</h2>
          <div className="bf-groups">
            {GROUPS.map((g) => (
              <div key={g.id} className="bf-group">
                <h3>{g.title}</h3>
                <ul className="bf-rows">
                  {g.rows.map((r) => (
                    <li key={r.name}>
                      <span className="bf-row-n">{r.name}{r.note && <small>{r.note}</small>}</span>
                      <Price r={r} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* how */}
        <section className="bf-wrap bf-sec">
          <Kicker a="cum prinzi reducerea" b="3 pași" />
          <h2 className="bf-h">Trei pași până pe {BF.endShort}</h2>
          <ol className="bf-steps">
            <li><b>01</b><strong>Ne scrii</strong>Pe WhatsApp sau email, pe scurt: ce vrei să construiești.</li>
            <li><b>02</b><strong>Primești oferta</strong>În cel mult o zi lucrătoare, cu prețul standard tăiat și prețul de Black Friday.</li>
            <li><b>03</b><strong>Semnezi și plătești avansul</strong>Până pe {BF.endLabel}. Lucrul poate începe și după campanie.</li>
          </ol>
        </section>

        {/* conditions */}
        <section className="bf-wrap bf-sec" id="conditii">
          <div className="bf-terms">
            <Kicker a="condiții" b="pe scurt și clar" />
            <h2 className="bf-h">Condițiile campaniei</h2>
            <ul>
              <li><strong>Perioada:</strong> {BF.startLabel} – {BF.endLabel} (ora României).</li>
              <li><strong>Reducerea de 50%</strong> se aplică la toate pachetele și serviciile de pe această pagină, pentru contractele semnate și cu avansul plătit în perioada campaniei. Lucrul poate începe și după campanie.</li>
              <li><strong>Abonamentele lunare</strong> au 50% reducere în primele 12 luni, apoi revin la prețul standard.</li>
              <li><strong>Prețul tăiat</strong> este prețul standard twopixeldev, cel mai mic preț practicat în ultimele 30 de zile înainte de campanie.</li>
              <li>Reducerea <strong>nu se cumulează</strong> cu alte reduceri sau oferte.</li>
              <li><strong>Prețurile sunt finale</strong>, fără TVA adăugat (prestatorul nu este înregistrat în scopuri de TVA).</li>
              <li>Prețurile „de la” și intervalele sunt de pornire; prețul exact apare în oferta scrisă pentru proiectul tău, tot cu 50% reducere.</li>
            </ul>
            <p className="bf-org">
              Campania este organizată de <strong>twopixeldev</strong>, nume comercial al {PFA.name}, sediu în {PFA.seat},
              CUI {PFA.cui}, Nr. ORC {PFA.orc}, EUID {PFA.euid}. Contact: <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
        </section>

        {/* faq */}
        <section className="bf-wrap bf-sec">
          <Kicker a="întrebări" b="răspunsuri" />
          <h2 className="bf-h">Întrebări frecvente</h2>
          <div className="bf-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* final call */}
        <section className="bf-sec bf-final">
          <TornBand seed={47} className="bf-band-sm">
            <p className="bf-spaced">până pe {BF.endShort}</p>
            <h2 className="bf-title bf-title-sm">Totul la jumătate</h2>
          </TornBand>
          <div className="bf-wrap bf-final-cta"><Ctas /></div>
        </section>
      </main>

      <footer className="bf-wrap bf-foot">
        <p>
          twopixeldev este numele comercial folosit de {PFA.name} · CUI {PFA.cui} · Nr. ORC {PFA.orc} · neînregistrat în scopuri de TVA
        </p>
        <nav aria-label="Legal">
          <Link href="/">Acasă</Link>
          <Link href="/termeni/">Termeni</Link>
          <Link href="/confidentialitate/">Confidențialitate</Link>
          <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">ANPC – SAL</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </nav>
      </footer>
    </div>
  );
}
