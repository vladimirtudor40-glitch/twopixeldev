import Link from 'next/link';
import { site } from '@/site.config';

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <nav aria-label="Legal">
          <Link href="/">Acasă</Link>
          <Link href="/confidentialitate/">Confidențialitate</Link>
          <Link href="/termeni/">Termeni</Link>
          <a href={`mailto:${site.contacts[0].email}`}>Contact</a>
        </nav>
      </div>
    </footer>
  );
}
