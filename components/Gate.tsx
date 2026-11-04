'use client';

import TwoPixelIntro from './TwoPixelIntro';

/** Public logo intro. Login is not reachable from here; it lives at a secret URL (see worker/index.ts). */
export default function Gate({ displayFont, monoFont }: { displayFont: string; monoFont: string }) {
  return (
    <div className="gate">
      <TwoPixelIntro
        className="intro"
        once
        tagline="[ SITE-URI // APLICAȚII // SOLUȚII IT ]"
        displayFont={displayFont}
        monoFont={monoFont}
      />
    </div>
  );
}
