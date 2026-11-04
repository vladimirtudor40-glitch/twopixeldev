import Link from 'next/link';
import { site } from '@/site.config';
import ThemeToggle from './ThemeToggle';

export default function SiteNav({ home = false }: { home?: boolean }) {
  const h = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <header className="wrap nav">
      <Link className="brand" href="/">two<i>pixel</i>dev</Link>
      <nav className="nav-links" aria-label="Principal">
        <a href={h('servicii')}>Servicii</a>
        <a href={h('cum-lucram')}>Cum lucrăm</a>
        <a href={h('contact')}>Contact</a>
      </nav>
      <div className="nav-end">
        <ThemeToggle />
        <a className="gbtn gbtn-sm" href={`mailto:${site.contacts[0].email}`}>Scrie-ne</a>
      </div>
    </header>
  );
}
