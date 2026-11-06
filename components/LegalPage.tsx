import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import CookieNotice from './CookieNotice';
import { site } from '@/site.config';
import { t, type Lang } from '@/lib/i18n';
import '@/app/public.css';

export default function LegalPage({ lang, page, title, children }: {
  lang: Lang; page: 'privacy' | 'terms'; title: string; children: React.ReactNode;
}) {
  return (
    <div className="neu">
      <SiteNav lang={lang} page={page} />
      <main className="wrap">
        <article className="legal-card">
          <h1>{title}</h1>
          <p className="muted">{t[lang].legal.updated}: {site.updated}</p>
          {children}
        </article>
      </main>
      <SiteFooter lang={lang} />
      <CookieNotice lang={lang} />
    </div>
  );
}
