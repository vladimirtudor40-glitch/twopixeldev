import Gate from '@/components/Gate';
import About from '@/components/About';
import SiteFooter from '@/components/SiteFooter';
import { display, mono } from './fonts';

export default function Home() {
  return (
    <>
      <main>
        <div className="stage">
          <h1 className="sr-only">twopixeldev: site-uri web pentru afaceri locale</h1>
          <Gate displayFont={display.style.fontFamily} monoFont={mono.style.fontFamily} />
          <a className="scroll-cue" href="#despre">despre noi ↓</a>
        </div>
        <About />
      </main>
      <SiteFooter />
    </>
  );
}
