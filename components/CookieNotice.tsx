'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { paths, t, type Lang } from '@/lib/i18n';

const KEY = 'tpd-cookie-notice';

/**
 * Cookie notice. The public site sets no tracking or advertising cookies, only strictly necessary
 * ones, so there is nothing to opt in to: this informs the visitor and is dismissed once.
 */
export default function CookieNotice({ lang }: { lang: Lang }) {
  const c = t[lang].cookies;
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { setShow(localStorage.getItem(KEY) !== '1'); } catch { setShow(true); }
  }, []);

  if (!show) return null;
  const ok = () => {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setShow(false);
  };

  return (
    <div className="cookie" role="region" aria-label={c.label}>
      <div className="cookie-ico" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.5A9 9 0 1 1 11.5 3a3 3 0 0 0 3.5 3.5 3 3 0 0 0 3.5 3.5 3 3 0 0 0 2.5 2.5Z" />
          <circle cx="8.5" cy="11.5" r=".9" fill="currentColor" /><circle cx="12" cy="16" r=".9" fill="currentColor" /><circle cx="15.5" cy="13" r=".9" fill="currentColor" />
        </svg>
      </div>
      <p>
        {c.text} <Link href={paths[lang].privacy}>{c.more}</Link>
      </p>
      <button type="button" className="gbtn gbtn-primary gbtn-sm" onClick={ok}>{c.ok}</button>
    </div>
  );
}
