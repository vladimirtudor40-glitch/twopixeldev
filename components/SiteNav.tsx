import Link from 'next/link';
import { site } from '@/site.config';
import { paths, t, type Lang } from '@/lib/i18n';
import ThemeToggle from './ThemeToggle';
import WhatsAppIcon from './WhatsAppIcon';

type Page = keyof (typeof paths)['ro'];

export default function SiteNav({ lang, page }: { lang: Lang; page: Page }) {
  const c = t[lang];
  const other: Lang = lang === 'ro' ? 'en' : 'ro';
  const home = paths[lang].home;
  const h = (id: string) => (page === 'home' ? `#${id}` : `${home}#${id}`);
  return (
    <header className="wrap nav">
      <Link className="brand" href={home}>two<i>pixel</i>dev</Link>
      <nav className="nav-links" aria-label={c.nav.main}>
        <a href={h(c.ids.services)}>{c.nav.services}</a>
        <a href={h(c.ids.process)}>{c.nav.process}</a>
        <a href={h(c.ids.contact)}>{c.nav.contact}</a>
      </nav>
      <div className="nav-end">
        <Link className="gbtn icon-btn lang-btn" href={paths[other][page]} hrefLang={other} lang={other}
          aria-label={c.nav.switchLabel} title={c.nav.switchTo}>
          {other.toUpperCase()}
        </Link>
        <ThemeToggle lang={lang} />
        {site.whatsapp && (
          <a className="gbtn icon-btn wa" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" aria-label={c.nav.waLabel} title="WhatsApp">
            <WhatsAppIcon />
          </a>
        )}
        <a className="gbtn gbtn-sm nav-write" href={`mailto:${site.email}`}>{c.nav.write}</a>
      </div>
    </header>
  );
}
