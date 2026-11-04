'use client';

import { useEffect, useId, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Number that counts up from its previous value. */
export function CountUp({ value, format = (n) => Math.round(n).toLocaleString('ro-RO'), ms = 900 }: {
  value: number; format?: (n: number) => string; ms?: number;
}) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (reduced()) { setShown(value); from.current = value; return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(a + (value - a) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return <>{format(shown)}</>;
}

export type Bar = { label: string; value: number; sub?: string };

const nice = (max: number) => {
  if (max <= 0) return 1000;
  const p = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};
const short = (n: number) => (n >= 1000 ? `${(n / 1000).toLocaleString('ro-RO', { maximumFractionDigits: 1 })}k` : `${Math.round(n)}`);

/** Rounded, hatched bars; the active bar (hovered or the last one) is filled with the brand gradient. */
export function BarChart({ bars, activeIndex, format }: { bars: Bar[]; activeIndex?: number; format: (n: number) => string }) {
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const top = nice(Math.max(...bars.map((b) => b.value), 0) * 1.1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => k * top);
  const active = hover ?? activeIndex ?? bars.length - 1;

  return (
    <div className="bars" role="img" aria-label={bars.map((b) => `${b.label}: ${format(b.value)}`).join(', ')}>
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <pattern id={`h${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="var(--bar-bg)" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="var(--bar-line)" strokeWidth="2.6" />
          </pattern>
        </defs>
      </svg>
      <div className="bars-y" aria-hidden>
        {ticks.map((t) => <span key={t} style={{ bottom: `calc(26px + (100% - 26px) * ${t / top})` }}>{short(t)}</span>)}
      </div>
      <div className="bars-plot">
        {ticks.map((t) => <i key={t} className="bars-grid" style={{ bottom: `calc(26px + (100% - 26px) * ${t / top})` }} />)}
        {bars.map((b, i) => {
          const h = Math.max(4, (b.value / top) * 100);
          const on = i === active;
          return (
            <div key={b.label + i} className={`bar-col${on ? ' on' : ''}`}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}>
              <div className="bar-track">
                <div className="bar" style={{ height: `${h}%`, animationDelay: `${i * 55}ms` }}>
                  <svg className="bar-hatch" width="100%" height="100%" aria-hidden><rect width="100%" height="100%" fill={`url(#h${id})`} /></svg>
                  <span className="bar-fill" />
                  {on && <span className="bar-dot" />}
                  {on && <span className="bar-tip">{format(b.value)}{b.sub && <small>{b.sub}</small>}</span>}
                </div>
              </div>
              <span className="bar-x">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type Slice = { label: string; value: number; color: string };

/** Thick donut with rounded, separated segments that draw in. */
export function Donut({ slices, center, sub }: { slices: Slice[]; center: React.ReactNode; sub: string }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = 70, c = 2 * Math.PI * r, gap = slices.filter((s) => s.value > 0).length > 1 ? 32 : 0;
  let acc = 0;
  return (
    <div className="donut">
      <svg viewBox="0 0 200 200" aria-hidden>
        <circle cx="100" cy="100" r={r} className="donut-track" />
        {total > 0 && slices.filter((s) => s.value > 0).map((s, i) => {
          const len = Math.max(0.5, (s.value / total) * c - gap);
          const off = acc;
          acc += (s.value / total) * c;
          return (
            <circle key={s.label} cx="100" cy="100" r={r} className="donut-seg"
              style={{ stroke: s.color, strokeDasharray: `${len} ${c}`, strokeDashoffset: -off, animationDelay: `${150 + i * 120}ms`, ['--len' as string]: len }} />
          );
        })}
      </svg>
      <div className="donut-c"><b>{center}</b><span>{sub}</span></div>
    </div>
  );
}

/** Smooth wave line with a soft area, drawn in. */
export function Sparkline({ values, color = 'var(--c1)' }: { values: number[]; color?: string }) {
  const id = useId().replace(/:/g, '');
  const w = 160, h = 64, pad = 6;
  const max = Math.max(...values, 1), min = Math.min(...values, 0);
  const pts = values.map((v, i) => [pad + (i * (w - 2 * pad)) / Math.max(1, values.length - 1), h - pad - ((v - min) / (max - min || 1)) * (h - 2 * pad)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`s${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w - pad},${h} L${pad},${h} Z`} fill={`url(#s${id})`} className="spark-area" />
      <path d={d} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" className="spark-line" pathLength={1} />
    </svg>
  );
}

/** Small progress ring (0–1). */
export function Ring({ value, size = 44, color = 'var(--c1)', children }: { value: number; size?: number; color?: string; children?: React.ReactNode }) {
  const r = 16, c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <span className="ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r={r} className="ring-track" />
        <circle cx="20" cy="20" r={r} className="ring-val" style={{ stroke: color, strokeDasharray: `${v * c} ${c}`, ['--len' as string]: v * c }} />
      </svg>
      <span>{children}</span>
    </span>
  );
}
