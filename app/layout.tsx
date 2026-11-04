import type { Metadata, Viewport } from 'next';
import { display, mono } from './fonts';
import { site } from '@/site.config';
import './globals.css';


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/favicon.svg` },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = { themeColor: '#070709' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" data-theme="dark" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* apply the saved theme before first paint, so light mode does not flash dark */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('tpd-theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
