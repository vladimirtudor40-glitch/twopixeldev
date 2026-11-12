import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { site } from '@/site.config';
import { BF, PFA } from '@/lib/blackfriday';
import Countdown from '@/components/bf/Countdown';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import BfStrip from '@/components/bf/BfStrip';
import '../blackfriday.css';

const title = 'Black Friday −50% | twopixeldev';
const description =
  'Black Friday la twopixeldev: 50% reducere, până pe 30 noiembrie 2026. Scrie-ne și îți trimitem oferta în aceeași zi.';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
const poster = `${base}/black-friday/oferta-speciala`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/black-friday/' },
  openGraph: {
    type: 'website', locale: 'ro_RO', url: `${site.url}/black-friday/`, siteName: site.name, title, description,
    images: [{ url: `${site.url}/black-friday/oferta-speciala.jpg`, width: 1080, height: 1350, alt: 'Ofertă specială Black Friday, 50% reducere, twopixeldev' }],
  },
};

export const viewport: Viewport = { themeColor: '#0b0b0e' };

const wa = site.whatsapp
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Salut! Vreau oferta de Black Friday (−50%) pentru: ')}`
  : '';
const mail = `mailto:${site.email}?subject=${encodeURIComponent('Ofertă Black Friday −50%')}`;

export default function BlackFriday() {
  return (
    <div className="bfp">
      <div className="bf-top">
        <BfStrip href={wa || mail} cta="Cere oferta" />
        <header className="bf-wrap bf-nav">
          <Link className="bf-brand" href="/" aria-label="twopixeldev, acasă">
            <span className="bf-px" aria-hidden><i /><i /></span>
            <span>two<em>pixel</em>dev</span>
          </Link>
          <nav className="bf-nav-end">
            <a href="#oferta">Ofertă</a>
            <Link href="/">Site</Link>
          </nav>
        </header>
      </div>

      <main className="bf-wrap bf-one">
        <h1 className="sr-only">Black Friday la twopixeldev: 50% reducere</h1>

        <picture className="bf-poster">
          <source srcSet={`${poster}.webp`} type="image/webp" />
          <img
            src={`${poster}.jpg`}
            width={1080}
            height={1350}
            alt="Ofertă specială: Black Friday, 50% reducere, twopixeldev"
            fetchPriority="high"
          />
        </picture>

        <div className="bf-side" id="oferta">
          <p className="bf-kicker">[ black friday // până pe {BF.endShort} ]</p>
          <p className="bf-h">50% reducere, până pe {BF.endShort}</p>
          <p className="bf-lead">
            Vrei un site, un magazin online sau o aplicație? Scrie-ne pe scurt ce ai nevoie și îți trimitem oferta în aceeași zi.
          </p>

          <div className="bf-cta">
            {wa && (
              <a className="bf-btn bf-btn-pink" href={wa} target="_blank" rel="noopener">
                <WhatsAppIcon /> Cere oferta pe WhatsApp
              </a>
            )}
            <a className="bf-btn" href={mail}>Scrie-ne pe email</a>
          </div>

          <Countdown />
        </div>
      </main>

      <section className="bf-wrap bf-small" aria-label="Condițiile campaniei">
        <p>
          <strong>Condiții:</strong> ofertă valabilă {BF.startLabel} – {BF.endLabel} (ora României), pentru contractele
          semnate și cu avansul plătit în această perioadă; lucrul poate începe și după. Reducerea se calculează din prețul
          standard twopixeldev, cel mai mic din ultimele 30 de zile înainte de campanie, și apare în oferta scrisă. Nu se
          cumulează cu alte reduceri. Prețuri finale, fără TVA (prestatorul nu este înregistrat în scopuri de TVA).
        </p>
      </section>

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
