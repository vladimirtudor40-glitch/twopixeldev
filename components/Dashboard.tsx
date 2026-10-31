'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { currentUser, deleteSite, isDemo, listSites, saveSite, signOut } from '@/lib/backend';
import { STATUSES, daysLeft, ownerLabel, statusLabel, type Site, type SiteInput, type Status } from '@/lib/types';
import SiteForm from './SiteForm';

const money = (n: number, c = 'RON') => `${n.toLocaleString('ro-RO', { maximumFractionDigits: 2 })} ${c}`;

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Status | 'toate'>('toate');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Site | 'new' | null>(null);

  const load = useCallback(async () => {
    try { setSites(await listSites()); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Eroare la încărcare'); }
  }, []);

  useEffect(() => {
    currentUser().then((u) => {
      if (!u) { router.replace('/'); return; }
      setUser(u);
      load();
    });
  }, [router, load]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (sites ?? []).filter((s) =>
      (filter === 'toate' || s.status === filter) &&
      (!term || [s.name, s.client_name, s.domain, s.hosting, s.notes].some((v) => v?.toLowerCase().includes(term))));
  }, [sites, filter, q]);

  const stats = useMemo(() => {
    const all = sites ?? [];
    return {
      total: all.length,
      live: all.filter((s) => s.status === 'live' || s.status === 'mentenanta').length,
      active: all.filter((s) => s.status === 'in_lucru').length,
      due: all.reduce((sum, s) => sum + Math.max(0, s.price - s.paid), 0),
      expiring: all.filter((s) => { const d = daysLeft(s.domain_expires); return d !== null && d <= 30; }).length,
    };
  }, [sites]);

  async function onSave(input: SiteInput, id?: string) {
    await saveSite(input, id);
    setEditing(null);
    await load();
  }
  async function onDelete(id: string) {
    await deleteSite(id);
    setEditing(null);
    await load();
  }
  async function logout() {
    await signOut();
    router.replace('/');
  }

  if (!user) return <div className="dash-boot">[ loading… ]</div>;

  return (
    <div className="dash">
      <header className="dash-top">
        <Link href="/" className="brand" aria-label="twopixeldev"><i className="px c" /><i className="px m" /><b>twopixeldev</b><span>// control</span></Link>
        <div className="who">
          {isDemo && <span className="demo-tag">demo</span>}
          <span className="dim">{user}</span>
          <button className="ghost" onClick={logout}>ieșire</button>
        </div>
      </header>

      <section className="stats" aria-label="Rezumat">
        <Stat label="site-uri" value={stats.total} />
        <Stat label="în lucru" value={stats.active} />
        <Stat label="live" value={stats.live} accent="cyan" />
        <Stat label="de încasat" value={money(stats.due)} accent={stats.due > 0 ? 'magenta' : undefined} />
        <Stat label="domenii ≤ 30 zile" value={stats.expiring} accent={stats.expiring ? 'magenta' : undefined} />
      </section>

      <section className="toolbar">
        <div className="tabs" role="tablist">
          {[{ id: 'toate', label: 'Toate' } as const, ...STATUSES].map((t) => (
            <button key={t.id} role="tab" aria-selected={filter === t.id} className={filter === t.id ? 'on' : ''} onClick={() => setFilter(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <input className="search" placeholder="caută…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Caută" />
          <button className="primary" onClick={() => setEditing('new')}>+ site nou</button>
        </div>
      </section>

      {error && <p className="err">{error}</p>}

      {sites === null ? (
        <p className="dim pad">se încarcă…</p>
      ) : shown.length === 0 ? (
        <div className="empty">
          <p>{sites.length ? 'Nimic pentru filtrul ăsta.' : 'Niciun site încă.'}</p>
          {!sites.length && <button className="primary" onClick={() => setEditing('new')}>+ adaugă primul site</button>}
        </div>
      ) : (
        <ul className="grid">
          {shown.map((s) => <Card key={s.id} site={s} onOpen={() => setEditing(s)} />)}
        </ul>
      )}

      {editing && (
        <SiteForm
          site={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: 'cyan' | 'magenta' }) {
  return (
    <div className={`stat ${accent ?? ''}`}>
      <span className="stat-v">{value}</span>
      <span className="stat-l">{label}</span>
    </div>
  );
}

function Card({ site: s, onOpen }: { site: Site; onOpen: () => void }) {
  const d = daysLeft(s.domain_expires);
  const due = Math.max(0, s.price - s.paid);
  return (
    <li>
      <button className="card" onClick={onOpen}>
        <div className="card-head">
          <span className={`badge st-${s.status}`}>{statusLabel(s.status)}</span>
          <span className="dim small">{ownerLabel(s.owner)}</span>
        </div>
        <h3>{s.name}</h3>
        <p className="dim small">{s.client_name || '—'}</p>
        <dl>
          <div><dt>domeniu</dt><dd>{s.domain || '—'}</dd></div>
          <div>
            <dt>expiră</dt>
            <dd className={d !== null && d <= 30 ? 'warn' : ''}>
              {s.domain_expires ? (d! < 0 ? `expirat (${-d!} zile)` : `${d} zile`) : '—'}
            </dd>
          </div>
          <div><dt>hosting</dt><dd>{s.hosting || '—'}</dd></div>
          <div><dt>plată</dt><dd className={due > 0 ? 'warn' : ''}>{s.price ? (due > 0 ? `${money(due, s.currency)} rest` : 'încasat') : '—'}</dd></div>
        </dl>
      </button>
    </li>
  );
}
