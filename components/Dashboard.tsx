'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currentUser, signOut } from '@/lib/backend';
import type { Payment, Project } from '@/lib/types';
import Leads from './Leads';
import Todos from './Todos';
import Icon from './crm/Icons';
import Overview from './crm/Overview';
import Projects, { ProjectForm } from './crm/Projects';
import Clients from './crm/Clients';
import Payments, { PaymentForm } from './crm/Payments';
import { Domains, Prices, Sites } from './crm/Misc';
import { SECTIONS, type Section } from './crm/nav';
import { useCrm } from './crm/store';
import { Avatar, PageHead } from './crm/ui';

type ProjectEdit = { project: Project | null; preset?: string; clientId?: string };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [section, setSection] = useState<Section>('overview');
  const [projectEdit, setProjectEdit] = useState<ProjectEdit | null>(null);
  const [paymentEdit, setPaymentEdit] = useState<Payment | 'new' | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const toLogin = useCallback(() => router.replace('/'), [router]);
  const crm = useCrm(toLogin);

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (SECTIONS.some((x) => x.id === h)) setSection(h as Section);
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    currentUser().then((u) => (u ? setUser(u) : router.replace('/')));
  }, [router]);

  const go = useCallback((s: Section) => {
    setSection(s);
    history.replaceState(null, '', s === 'overview' ? window.location.pathname : `#${s}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('tpd-theme', next); } catch {}
      setTheme(next);
    };
    const d = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (d.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) d.startViewTransition(apply);
    else apply();
  }

  async function logout() { await signOut(); router.replace('/'); }

  const openProject = (p: Project | 'new', preset?: string, clientId?: string) =>
    setProjectEdit({ project: p === 'new' ? null : p, preset, clientId });

  if (!user || !crm.data) {
    return (
      <div className="crm boot">
        <span className="boot-px"><i /><i /></span>
        {crm.error ? <p className="err">{crm.error}</p> : <p>se încarcă…</p>}
      </div>
    );
  }
  const data = crm.data;
  const display = user.startsWith('evelina') ? 'Evelina' : user.startsWith('vladimir') ? 'Vladimir' : user.split('@')[0];

  return (
    <div className="crm">
      <header className="top">
        <a href="/" className="logo" aria-label="twopixeldev, pagina publică">
          <span className="logo-px"><i /><i /></span>
          <b>twopixel<em>dev</em></b>
        </a>
        <GlobalSearch data={data} onPick={(s, open) => { go(s); open?.(); }} openProject={(p) => openProject(p)} />
        <div className="top-r">
          <button className="icon-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Temă deschisă' : 'Temă închisă'} title="Schimbă tema">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
          <span className="hi">Salut, {display}!</span>
          <Avatar name={display} size={44} />
        </div>
      </header>

      <nav className="rail" aria-label="Secțiuni">
        <div className="rail-g">
          {SECTIONS.map((s) => (
            <button key={s.id} className={section === s.id ? 'on' : ''} aria-current={section === s.id ? 'page' : undefined} onClick={() => go(s.id)} data-tip={s.label}>
              <Icon name={s.icon} size={20} /><span>{s.label}</span>
            </button>
          ))}
        </div>
        <div className="rail-g rail-b">
          <button onClick={logout} data-tip="Ieșire" aria-label="Ieșire"><Icon name="logout" size={20} /><span>Ieșire</span></button>
        </div>
      </nav>

      <main className="main" key={section}>
        {section === 'overview' && <Overview data={data} crm={crm} go={go} user={user} onNewProject={() => openProject('new')} onOpenPayment={setPaymentEdit} />}
        {section === 'projects' && <Projects data={data} crm={crm} onOpen={(p) => openProject(p)} />}
        {section === 'clients' && <Clients data={data} crm={crm} onOpenProject={(id) => openProject('new', undefined, id)} />}
        {section === 'payments' && <Payments data={data} onOpen={setPaymentEdit} />}
        {section === 'sites' && <Sites data={data} crm={crm} />}
        {section === 'domains' && <Domains data={data} crm={crm} />}
        {section === 'prices' && <Prices onUse={(id) => openProject('new', id)} />}
        {section === 'todos' && <div className="view legacy"><PageHead title="To-do" sub="Sarcinile voastre, cu termen și site legat." /><Todos onUnauthorized={toLogin} /></div>}
        {section === 'leads' && <div className="view legacy"><PageHead title="Leaduri" sub="Firme de contactat, ordonate după scor." /><Leads onUnauthorized={toLogin} /></div>}
      </main>

      {projectEdit && (
        <ProjectForm
          key={projectEdit.project?.id ?? 'new'}
          project={projectEdit.project}
          preset={projectEdit.preset}
          data={data}
          crm={crm}
          onClose={() => setProjectEdit(null)}
          initialClient={projectEdit.clientId}
        />
      )}
      {paymentEdit && <PaymentForm payment={paymentEdit === 'new' ? null : paymentEdit} data={data} crm={crm} onClose={() => setPaymentEdit(null)} />}
    </div>
  );
}

type Hit = { key: string; label: string; sub: string; section: Section; open?: () => void };

function GlobalSearch({ data, onPick, openProject }: {
  data: NonNullable<ReturnType<typeof useCrm>['data']>; onPick: (s: Section, open?: () => void) => void; openProject: (p: Project) => void;
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) {
        e.preventDefault(); ref.current?.querySelector('input')?.focus();
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); };
  }, []);

  const hits = useMemo<Hit[]>(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    const has = (...v: (string | null | undefined)[]) => v.some((x) => x?.toLowerCase().includes(t));
    return [
      ...data.projects.filter((p) => has(p.name, p.notes)).map((p) => ({ key: p.id, label: p.name, sub: 'proiect', section: 'projects' as Section, open: () => openProject(p) })),
      ...data.clients.filter((c) => has(c.name, c.company, c.email, c.phone)).map((c) => ({ key: c.id, label: c.name, sub: 'client', section: 'clients' as Section })),
      ...data.sites.filter((s) => has(s.name, s.domain, s.client_name)).map((s) => ({ key: s.id, label: s.name, sub: s.domain || 'site', section: 'sites' as Section })),
      ...data.leads.filter((l) => has(l.name, l.category, l.city)).map((l) => ({ key: l.id, label: l.name, sub: 'lead', section: 'leads' as Section })),
    ].slice(0, 8);
  }, [q, data, openProject]);

  return (
    <div className="gsearch" ref={ref}>
      <label className="search-in big">
        <Icon name="search" size={18} />
        <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          placeholder="Caută client, proiect, site…" aria-label="Caută în CRM" />
        <kbd>/</kbd>
      </label>
      {open && q.trim().length >= 2 && (
        <ul className="gs-list">
          {hits.length === 0 && <li className="dim small">Nimic găsit.</li>}
          {hits.map((h) => (
            <li key={h.section + h.key}>
              <button onClick={() => { onPick(h.section, h.open); setOpen(false); setQ(''); }}>
                <b>{h.label}</b><span className="dim small">{h.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
