import type { Metadata, Viewport } from 'next';
import { display, mono } from './fonts';
import { site } from '@/site.config';
import './globals.css';


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg` },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#070709' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
