import Link from 'next/link';
import { site } from '@/site.config';
import ThemeToggle from './ThemeToggle';
import WhatsAppIcon from './WhatsAppIcon';

export default function SiteNav({ home = false }: { home?: boolean }) {
  const h = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <header className="wrap nav">
      <Link className="brand" href="/">two<i>pixel</i>dev</Link>
      <nav className="nav-links" aria-label="Principal">
        <a href={h('servicii')}>Servicii</a>
        <a href={h('cum-lucram')}>Cum lucrăm</a>
        <a href={h('contact')}>Contact</a>
      </nav>
      <div className="nav-end">
        <ThemeToggle />
        {site.whatsapp && (
          <a className="gbtn icon-btn wa" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" aria-label="Scrie-ne pe WhatsApp" title="WhatsApp">
            <WhatsAppIcon />
          </a>
        )}
        <a className="gbtn gbtn-sm" href={`mailto:${site.email}`}>Scrie-ne</a>
      </div>
    </header>
  );
}
