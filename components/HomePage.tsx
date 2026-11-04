import Gate from './Gate';
import About from './About';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import SetLang from './SetLang';
import CookieNotice from './CookieNotice';
import { display, mono } from '@/app/fonts';
import { t, type Lang } from '@/lib/i18n';
import '@/app/public.css';

export default function HomePage({ lang }: { lang: Lang }) {
  return (
    <div className="neu">
      <SetLang lang={lang} />
      <SiteNav lang={lang} page="home" />
      <main>
        <div className="wrap">
          <div className="hero-frame">
            <div className="stage">
              <Gate tagline={t[lang].tagline} displayFont={display.style.fontFamily} monoFont={mono.style.fontFamily} />
            </div>
          </div>
        </div>
        <About lang={lang} />
      </main>
      <SiteFooter lang={lang} />
      <CookieNotice lang={lang} />
    </div>
  );
}
