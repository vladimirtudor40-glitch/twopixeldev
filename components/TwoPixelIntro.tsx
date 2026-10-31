'use client';

import { useEffect, useRef } from 'react';
import { createTwoPixelIntro, type IntroController, type IntroOptions } from './twopixel-intro-engine';

type Props = IntroOptions & {
  className?: string;
  /** Accessible description of the animation. */
  label?: string;
  /** Receives the engine controller once it is created. */
  onReady?: (intro: IntroController) => void;
};

/**
 * Full-bleed twopixeldev intro. Size it with the parent; the canvas fills it.
 * Respects prefers-reduced-motion by jumping straight to the hold frame.
 */
export default function TwoPixelIntro({ className, label = 'twopixeldev logo', onReady, ...options }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const holdAt = options.holdAt ?? 6.2;
    const intro = createTwoPixelIntro(canvas, { ...options, autoplay: !reduce.matches });
    if (reduce.matches) {
      intro.seek(holdAt);
      options.onComplete?.();
    }
    onReady?.(intro);
    return () => intro.destroy();
    // options are read once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', background: '#070709' }}
    />
  );
}
