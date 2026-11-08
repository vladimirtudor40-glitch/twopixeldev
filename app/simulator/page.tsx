import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CookieNotice from '@/components/CookieNotice';
import Simulator from '@/components/Simulator';
import '@/app/public.css';
import '@/app/simulator.css';

export const metadata: Metadata = {
  title: 'Simulator: vezi cum ar arăta site-ul tău | twopixeldev',
  description:
    'Alege domeniul afacerii și locația, apoi vezi live cinci stiluri de site, pe calculator și pe telefon, cu prețul din oferta twopixeldev.',
  alternates: { canonical: '/simulator/' },
};

export default function SimulatorPage() {
  return (
    <div className="neu">
      <SiteNav lang="ro" page="simulator" />
      <main>
        <Simulator />
      </main>
      <SiteFooter lang="ro" />
      <CookieNotice lang="ro" />
    </div>
  );
}
