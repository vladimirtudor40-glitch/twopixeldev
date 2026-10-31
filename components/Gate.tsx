'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import TwoPixelIntro from './TwoPixelIntro';
import LoginPanel from './LoginPanel';
import type { IntroController } from './twopixel-intro-engine';
import { useRouter } from 'next/navigation';
import { currentUser } from '@/lib/backend';

// Login is off until real accounts exist (set NEXT_PUBLIC_LOGIN_ENABLED=true to turn it on).
const LOGIN_ENABLED = process.env.NEXT_PUBLIC_LOGIN_ENABLED === 'true';

type Box = { left: string; top: string; width: string; height: string };

/** Logo intro → (click the logo) → login panel. */
export default function Gate({ displayFont, monoFont }: { displayFont: string; monoFont: string }) {
  const intro = useRef<IntroController | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<Box | null>(null);
  const router = useRouter();

  // already signed in → the logo goes straight to the app
  const onLogo = async () => ((await currentUser()) ? router.push('/app/') : setOpen(true));

  const measure = useCallback(() => {
    if (!intro.current) return;
    const b = intro.current.wordmarkBox();
    setBox({
      left: `${(b.cx - b.w / 2) * 100}%`,
      top: `${(b.cy - b.h / 2) * 100}%`,
      width: `${b.w * 100}%`,
      height: `${b.h * 100}%`,
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ready, measure]);

  return (
    <div className={`gate${open ? ' gate-open' : ''}`}>
      <TwoPixelIntro
        className="intro"
        once
        tagline={LOGIN_ENABLED ? '[ RESTRICTED ACCESS // CLICK LOGO TO LOGIN ]' : '[ SYSTEM INITIALIZING // SITE IN DEVELOPMENT ]'}
        displayFont={displayFont}
        monoFont={monoFont}
        onReady={(c) => { intro.current = c; }}
        onComplete={() => setReady(true)}
      />
      {LOGIN_ENABLED && ready && box && !open && (
        <button className="logo-hit" style={box} onClick={onLogo} aria-label="Open login" autoFocus />
      )}
      {LOGIN_ENABLED && open && <LoginPanel onClose={() => setOpen(false)} />}
    </div>
  );
}
