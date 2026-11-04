import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import { site } from '@/site.config';
import '@/app/public.css';

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="neu">
      <SiteNav />
      <main className="wrap">
        <article className="legal-card">
          <h1>{title}</h1>
          <p className="muted">Ultima actualizare: {site.updated}</p>
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
