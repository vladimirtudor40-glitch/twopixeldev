'use client';

import { useEffect, useState } from 'react';
import { BF } from '@/lib/blackfriday';

const END = new Date(BF.end).getTime();
const START = new Date(BF.start).getTime();

/** Live countdown to the end of the campaign; says so once it is over. */
export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now !== null && now > END) {
    return (
      <p className="bf-over" role="status">
        Campania s-a încheiat pe {BF.endLabel}. Prețurile reduse de pe această pagină nu mai sunt valabile.
        Scrie-ne pentru o ofertă la prețurile standard.
      </p>
    );
  }
  if (now !== null && now < START) return null;

  const left = now === null ? null : Math.max(0, END - now);
  const parts = left === null
    ? [['zile', '--'], ['ore', '--'], ['min', '--'], ['sec', '--']]
    : [
        ['zile', Math.floor(left / 864e5)],
        ['ore', Math.floor(left / 36e5) % 24],
        ['min', Math.floor(left / 6e4) % 60],
        ['sec', Math.floor(left / 1e3) % 60],
      ];
  return (
    <div className="bf-count" aria-label={`Oferta se încheie pe ${BF.endLabel}`}>
      <span className="bf-count-l">se termină în</span>
      <div className="bf-count-n" aria-hidden>
        {parts.map(([l, v]) => (
          <span key={l as string}><b>{typeof v === 'number' ? String(v).padStart(2, '0') : v}</b><i>{l}</i></span>
        ))}
      </div>
    </div>
  );
}
