'use client';

import { useEffect, useState } from 'react';
import { t, type Lang } from '@/lib/i18n';

type Theme = 'dark' | 'light';

/** Switches the public pages (and the logo animation) between dark and light. Remembered per browser. */
export default function ThemeToggle({ lang }: { lang: Lang }) {
  const c = t[lang].theme;
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('tpd-theme', next); } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      className="gbtn theme-btn"
      onClick={toggle}
      aria-label={theme === 'dark' ? c.toLight : c.toDark}
      title={theme === 'dark' ? c.light : c.dark}
    >
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
