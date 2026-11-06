import About from './About';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import CookieNotice from './CookieNotice';
import { type Lang } from '@/lib/i18n';
import '@/app/public.css';

export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <div className="neu">
      <SiteNav lang={lang} page="home" />
      <main>
        <About lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      <CookieNotice lang={lang} />
    </div>
  );
}
