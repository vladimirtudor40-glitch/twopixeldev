import { Unbounded, JetBrains_Mono } from 'next/font/google';

export const display = Unbounded({ subsets: ['latin'], weight: '800', variable: '--font-display' });
export const mono = JetBrains_Mono({ subsets: ['latin'], weight: '500', variable: '--font-mono' });
// Lighter Unbounded weights for the internal CRM (headings, numbers). Applied only on /app.
export const displaySoft = Unbounded({ subsets: ['latin', 'latin-ext'], weight: ['400', '600'], variable: '--font-ui' });
