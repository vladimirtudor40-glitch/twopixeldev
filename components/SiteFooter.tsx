import Link from 'next/link';
import { site } from '@/site.config';

export default function SiteFooter() {
  return (
    <footer className="wrap foot">
      <div className="foot-in">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <nav aria-label="Legal">
          <Link href="/">Acasă</Link>
          <Link href="/confidentialitate/">Confidențialitate</Link>
          <Link href="/termeni/">Termeni</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </nav>
      </div>
    </footer>
  );
}
