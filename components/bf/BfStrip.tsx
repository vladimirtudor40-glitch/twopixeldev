'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BF } from '@/lib/blackfriday';

/** Thin Black Friday bar on top of the public pages. Disappears by itself after the campaign. */
export default function BfStrip() {
  const [live, setLive] = useState(true);
  useEffect(() => {
    const n = Date.now();
    setLive(n >= new Date(BF.start).getTime() && n <= new Date(BF.end).getTime());
  }, []);
  if (!live) return null;
  return (
    <Link className="bf-strip" href="/black-friday/">
      <span className="bf-strip-k">[ black friday // −50% ]</span>
      <span className="bf-strip-t">Totul la jumătate de preț, până pe {BF.endShort}.</span>
      <span className="bf-strip-go">Vezi oferta →</span>
    </Link>
  );
}
