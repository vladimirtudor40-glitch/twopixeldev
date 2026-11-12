// A strip of torn pink paper across the page (the Black Friday poster look).
// The ragged edges are generated once, deterministically, so server and client render the same SVG.

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Ragged line from x=0 to x=1000 around `base`, returned as SVG path points. */
function ragged(seed: number, base: number, amp: number, fine: number) {
  const r = rng(seed);
  const pts: string[] = [];
  let x = 0;
  const p1 = r() * 6, p2 = r() * 6;
  while (x <= 1000) {
    const wave = Math.sin(x / 90 + p1) * amp * 0.55 + Math.sin(x / 37 + p2) * amp * 0.3;
    const y = base + wave + (r() - 0.5) * fine;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    x += 2 + r() * 8;
  }
  pts.push(`1000,${base}`);
  return pts.join(' L');
}

/** One edge. `side="top"`: paper below the line; `side="bottom"`: paper above it. */
function Edge({ side, seed }: { side: 'top' | 'bottom'; seed: number }) {
  // fringe = the lighter, fibrous torn layer; body = the paper itself
  const fringe = ragged(seed, 30, 22, 12);
  const body = ragged(seed + 7, 44, 18, 7);
  const flip = side === 'bottom' ? { transform: 'translate(0,80) scale(1,-1)' } : {};
  return (
    <svg className={`bf-edge bf-edge-${side}`} viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden>
      <g {...flip}>
        <path d={`M${fringe} L1000,80 L0,80 Z`} fill="var(--paper-hi)" />
        <path d={`M${body} L1000,80 L0,80 Z`} fill="var(--paper)" />
      </g>
    </svg>
  );
}

export default function TornBand({ children, seed = 11, className = '' }: { children: React.ReactNode; seed?: number; className?: string }) {
  return (
    <div className={`bf-band ${className}`}>
      <Edge side="top" seed={seed} />
      <div className="bf-band-in">{children}</div>
      <Edge side="bottom" seed={seed + 31} />
    </div>
  );
}
