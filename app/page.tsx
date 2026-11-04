import Gate from '@/components/Gate';
import About from '@/components/About';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { display, mono } from './fonts';
import './public.css';

export default function Home() {
  return (
    <div className="neu">
      <SiteNav home />
      <main>
        <div className="wrap">
          <div className="hero-frame">
            <div className="stage">
              <Gate displayFont={display.style.fontFamily} monoFont={mono.style.fontFamily} />
            </div>
          </div>
        </div>
        <About />
      </main>
      <SiteFooter />
    </div>
  );
}
