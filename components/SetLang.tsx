'use client';

import { useEffect } from 'react';

// The root layout is shared and says lang="ro". Each public page sets the right value:
// the inline script covers the first paint, the effect covers client-side navigation.
export default function SetLang({ lang }: { lang: string }) {
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />;
}
