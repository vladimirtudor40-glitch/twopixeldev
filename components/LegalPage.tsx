import Link from 'next/link';
import SiteFooter from './SiteFooter';
import { site } from '@/site.config';

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <main className="legal wrap">
        <Link className="back" href="/">← twopixeldev</Link>
        <h1>{title}</h1>
        <p className="muted">Ultima actualizare: {site.updated}</p>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
