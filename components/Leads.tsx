'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteItem, listCol, saveItem } from '@/lib/backend';
import {
  LEAD_STATUSES, OWNERS, emptyLead, ownerLabel,
  type Lead, type LeadInput, type LeadStatus,
} from '@/lib/types';

const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, '').replace(/^0/, '+40')}`;

export default function Leads({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<LeadStatus | 'toate' | 'active'>('active');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Lead | 'new' | null>(null);

  const load = useCallback(async () => {
    try { setLeads(await listCol<Lead>('leads')); setError(''); }
    catch (e) {
      if (e instanceof Error && e.message === 'unauthorized') onUnauthorized();
      else setError(e instanceof Error ? e.message : 'Eroare la încărcare');
    }
  }, [onUnauthorized]);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (leads ?? [])
      .filter((l) =>
        (filter === 'toate' || (filter === 'active' ? !['castigat', 'pierdut'].includes(l.status) : l.status === filter)) &&
        (!term || [l.name, l.category, l.city, l.address, l.notes, l.phone].some((v) => v?.toLowerCase().includes(term))))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [leads, filter, q]);

  const stats = useMemo(() => {
    const all = leads ?? [];
    const by = (s: LeadStatus) => all.filter((l) => l.status === s).length;
    return { total: all.length, nou: by('nou'), progres: by('contactat') + by('raspuns') + by('oferta'), castigat: by('castigat'), high: all.filter((l) => l.score >= 8 && l.status === 'nou').length };
  }, [leads]);

  async function quickStatus(l: Lead, status: LeadStatus) {
    setLeads((p) => p?.map((x) => (x.id === l.id ? { ...x, status } : x)) ?? p);
    try { await saveItem('leads', { status }, l.id); } catch { await load(); }
  }
  async function onSave(input: LeadInput, id?: string) { await saveItem('leads', input, id); setEditing(null); await load(); }
  async function onDelete(id: string) { await deleteItem('leads', id); setEditing(null); await load(); }

  return (
    <>
      <section className="stats" aria-label="Rezumat leaduri">
        <Stat label="leaduri" value={stats.total} />
        <Stat label="necontactate" value={stats.nou} />
        <Stat label="prioritate mare, noi" value={stats.high} accent={stats.high ? 'magenta' : undefined} />
        <Stat label="în discuții" value={stats.progres} />
        <Stat label="câștigate" value={stats.castigat} accent="cyan" />
      </section>

      <section className="toolbar">
        <div className="tabs" role="tablist">
          {[{ id: 'active', label: 'Active' } as const, { id: 'toate', label: 'Toate' } as const, ...LEAD_STATUSES].map((t) => (
            <button key={t.id} role="tab" aria-selected={filter === t.id} className={filter === t.id ? 'on' : ''} onClick={() => setFilter(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="toolbar-right">
          <input className="search" placeholder="caută…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Caută leaduri" />
          <button className="primary" onClick={() => setEditing('new')}>+ lead nou</button>
        </div>
      </section>

      {error && <p className="err">{error}</p>}

      {leads === null ? <p className="dim pad">se încarcă…</p> : shown.length === 0 ? (
        <div className="empty"><p>{leads.length ? 'Nimic pentru filtrul ăsta.' : 'Niciun lead încă.'}</p></div>
      ) : (
        <ul className="grid">
          {shown.map((l) => (
            <li key={l.id}>
              <div className="card lead">
                <div className="card-head">
                  <select className={`badge-select ls-${l.status}`} value={l.status} onChange={(e) => quickStatus(l, e.target.value as LeadStatus)} aria-label={`Status ${l.name}`}>
                    {LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <span className={`score ${l.score >= 8 ? 'hi' : ''}`} title="scor potrivire">{l.score}/10</span>
                </div>
                <button className="lead-open" onClick={() => setEditing(l)}>
                  <h3>{l.name}</h3>
                  <p className="dim small">{[l.category, l.city].filter(Boolean).join(' · ') || '—'}</p>
                  {l.next_step && <p className="next small">→ {l.next_step}</p>}
                </button>
                <div className="lead-foot small">
                  {l.phone ? <a href={telHref(l.phone)}>{l.phone}</a> : <span className="dim">fără telefon</span>}
                  <span className="dim">{ownerLabel(l.owner)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && <LeadForm lead={editing === 'new' ? null : editing} onCancel={() => setEditing(null)} onSave={onSave} onDelete={onDelete} />}
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: 'cyan' | 'magenta' }) {
  return <div className={`stat ${accent ?? ''}`}><span className="stat-v">{value}</span><span className="stat-l">{label}</span></div>;
}

function LeadForm({ lead, onCancel, onSave, onDelete }: {
  lead: Lead | null; onCancel: () => void;
  onSave: (input: LeadInput, id?: string) => Promise<void>; onDelete: (id: string) => Promise<void>;
}) {
  const [v, setV] = useState<LeadInput>(() => {
    if (!lead) return emptyLead();
    const { id: _i, created_at: _c, updated_at: _u, updated_by: _b, ...rest } = lead;
    return { ...emptyLead(), ...rest };
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const set = <K extends keyof LeadInput>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try { await onSave(v, lead?.id); } catch (x) { setErr(x instanceof Error ? x.message : 'Nu s-a putut salva'); setBusy(false); }
  }

  const text = (k: keyof LeadInput, label: string, type = 'text', extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="f"><span>{label}</span><input type={type} value={(v[k] as string | number | null) ?? ''} onChange={set(k)} {...extra} /></label>
  );
  const area = (k: keyof LeadInput, label: string, rows = 3) => (
    <label className="f"><span>{label}</span><textarea rows={rows} value={(v[k] as string | null) ?? ''} onChange={set(k)} /></label>
  );

  return (
    <div className="drawer-bg" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <form className="drawer" onSubmit={submit} aria-label={lead ? `Editează ${lead.name}` : 'Lead nou'}>
        <header>
          <h2>{lead ? lead.name : 'lead nou'}</h2>
          <button type="button" className="ghost" onClick={onCancel} aria-label="Închide">esc</button>
        </header>

        <fieldset><legend>firmă</legend>
          {text('name', 'nume', 'text', { required: true, autoFocus: !lead })}
          <div className="row">{text('category', 'domeniu', 'text', { placeholder: 'cofetărie, pensiune…' })}{text('city', 'oraș')}</div>
          {text('address', 'adresă')}
          <div className="row">{text('phone', 'telefon', 'tel')}{text('website', 'site actual', 'text', { placeholder: 'gol = nu are' })}</div>
        </fieldset>

        <fieldset><legend>pipeline</legend>
          <div className="row three">
            <label className="f"><span>status</span>
              <select value={v.status} onChange={set('status')}>{LEAD_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
            </label>
            <label className="f"><span>cine se ocupă</span>
              <select value={v.owner} onChange={set('owner')}>{OWNERS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
            </label>
            {text('score', 'scor', 'number', { min: 1, max: 10 })}
          </div>
          {text('next_step', 'pasul următor')}
        </fieldset>

        {area('pitch', 'ce le propunem')}
        {area('notes', 'note', 4)}
        {text('source', 'sursă')}
        {lead?.updated_by && lead.updated_by !== 'seed' && <p className="dim small">ultima modificare: {lead.updated_by} · {new Date(lead.updated_at).toLocaleString('ro-RO')}</p>}

        {err && <p className="err">{err}</p>}
        <footer>
          {lead && (confirmDel
            ? <button type="button" className="danger" onClick={() => onDelete(lead.id)}>sigur? șterge</button>
            : <button type="button" className="ghost" onClick={() => setConfirmDel(true)}>șterge</button>)}
          <span className="grow" />
          <button type="button" className="ghost" onClick={onCancel}>anulează</button>
          <button type="submit" className="primary" disabled={busy}>{busy ? 'se salvează…' : 'salvează'}</button>
        </footer>
      </form>
    </div>
  );
}

