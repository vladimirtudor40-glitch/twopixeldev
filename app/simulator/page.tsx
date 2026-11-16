import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import CookieNotice from '@/components/CookieNotice';
import BfStrip from '@/components/bf/BfStrip';
import Simulator from '@/components/Simulator';
import '@/app/public.css';
import '@/app/simulator.css';

export const metadata: Metadata = {
  title: 'Simulator: vezi cum ar arăta site-ul tău | twopixeldev',
  description:
    'Alege domeniul afacerii și locația, apoi vezi live cinci stiluri de site, pe calculator și pe telefon, apoi cere o ofertă pe WhatsApp sau email.',
  alternates: { canonical: '/simulator/' },
};

export default function SimulatorPage() {
  return (
    <div className="neu">
      <div className="site-top">
        <BfStrip />
        <SiteNav lang="ro" page="simulator" />
      </div>
      <main>
        <Simulator />
      </main>
      <SiteFooter lang="ro" />
      <CookieNotice lang="ro" />
    </div>
  );
}
