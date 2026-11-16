import Link from 'next/link';
import { site } from '@/site.config';
import { paths, t, type Lang } from '@/lib/i18n';

export default function SiteFooter({ lang }: { lang: Lang }) {
  const c = t[lang].footer;
  const p = paths[lang];
  return (
    <footer className="wrap foot">
      <div className="foot-in">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <nav aria-label={c.legal}>
          <Link href={p.home}>{c.home}</Link>
          <Link href={p.simulator}>Simulator</Link>
          <Link href={p.privacy}>{c.privacy}</Link>
          <Link href={p.terms}>{c.terms}</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </nav>
      </div>
    </footer>
  );
}
