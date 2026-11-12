'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BF } from '@/lib/blackfriday';
import '@/app/bfstrip.css';

/** Thin Black Friday bar on top of the public pages. Disappears by itself after the campaign. */
/** On the Black Friday page itself, pass `href` (e.g. WhatsApp) and `cta` so the bar asks for an offer. */
export default function BfStrip({ href, cta }: { href?: string; cta?: string } = {}) {
  const [live, setLive] = useState(true);
  useEffect(() => {
    const n = Date.now();
    setLive(n >= new Date(BF.start).getTime() && n <= new Date(BF.end).getTime());
  }, []);
  if (!live) return null;
  const inner = (
    <>
      <span className="bf-strip-k">[ black friday // −50% ]</span>
      <span className="bf-strip-t">Landing page și site de prezentare la jumătate de preț, până pe {BF.endShort}.</span>
      <span className="bf-strip-s">Black Friday −50% · {BF.endShort}</span>
      <span className="bf-strip-go">{cta ?? 'Vezi oferta'} →</span>
    </>
  );
  return href
    ? <a className="bf-strip" href={href} target="_blank" rel="noopener">{inner}</a>
    : <Link className="bf-strip" href="/black-friday/">{inner}</Link>;
}
