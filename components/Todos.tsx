'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteItem, listCol, listSites, saveItem } from '@/lib/backend';
import { OWNERS, daysLeft, ownerLabel, type Owner, type Site, type Todo } from '@/lib/types';

type Filter = 'deschise' | Owner | 'gata';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'deschise', label: 'De făcut' },
  { id: 'vladimir', label: 'Vladimir' },
  { id: 'eve', label: 'Evelina' },
  { id: 'gata', label: 'Gata' },
];

function dueLabel(due: string) {
  const d = daysLeft(due) ?? 0;
  if (d < 0) return { text: `întârziat ${-d} ${-d === 1 ? 'zi' : 'zile'}`, cls: 'late' };
  if (d === 0) return { text: 'azi', cls: 'soon' };
  if (d === 1) return { text: 'mâine', cls: 'soon' };
  return { text: new Date(due + 'T00:00:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }), cls: '' };
}

export default function Todos({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('deschise');
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState<Owner>('amandoi');
  const [due, setDue] = useState('');
  const [siteId, setSiteId] = useState('');

  const fail = useCallback((e: unknown) => {
    if (e instanceof Error && e.message === 'unauthorized') onUnauthorized();
    else setError(e instanceof Error ? e.message : 'Eroare');
  }, [onUnauthorized]);

  const load = useCallback(async () => {
    try {
      const [t, s] = await Promise.all([listCol<Todo>('todos'), listSites()]);
      setTodos(t); setSites(s); setError('');
    } catch (e) { fail(e); }
  }, [fail]);
  useEffect(() => { load(); }, [load]);

  const siteName = useMemo(() => new Map(sites.map((s) => [s.id, s.name])), [sites]);

  const shown = useMemo(() => {
    const all = todos ?? [];
    const list = filter === 'gata' ? all.filter((t) => t.done)
      : all.filter((t) => !t.done && (filter === 'deschise' || t.owner === filter || t.owner === 'amandoi'));
    return [...list].sort((a, b) =>
      filter === 'gata' ? b.updated_at.localeCompare(a.updated_at)
        : (a.due ?? '9999').localeCompare(b.due ?? '9999') || b.created_at.localeCompare(a.created_at));
  }, [todos, filter]);

  const open = (todos ?? []).filter((t) => !t.done);
  const late = open.filter((t) => t.due && (daysLeft(t.due) ?? 0) < 0).length;
  const today = open.filter((t) => t.due && daysLeft(t.due) === 0).length;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    try {
      await saveItem('todos', { title: t, done: false, owner, due: due || null, site_id: siteId || null });
      setTitle(''); setDue('');
      await load();
    } catch (err) { fail(err); }
  }

  async function update(t: Todo, patch: Partial<Todo>) {
    setTodos((p) => p?.map((x) => (x.id === t.id ? { ...x, ...patch, updated_at: new Date().toISOString() } : x)) ?? p);
    try { await saveItem('todos', patch, t.id); } catch (e) { fail(e); await load(); }
  }

  async function remove(t: Todo) {
    setTodos((p) => p?.filter((x) => x.id !== t.id) ?? p);
    try { await deleteItem('todos', t.id); } catch (e) { fail(e); await load(); }
  }

  return (
    <>
      <section className="stats" aria-label="Rezumat to-do">
        <div className="stat"><span className="stat-v">{open.length}</span><span className="stat-l">de făcut</span></div>
        <div className="stat magenta"><span className="stat-v">{late}</span><span className="stat-l">întârziate</span></div>
        <div className="stat cyan"><span className="stat-v">{today}</span><span className="stat-l">pentru azi</span></div>
        <div className="stat"><span className="stat-v">{(todos ?? []).length - open.length}</span><span className="stat-l">gata</span></div>
      </section>

      <form className="todo-add" onSubmit={add}>
        <input className="search todo-title" placeholder="ce e de făcut…" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Sarcină nouă" />
        <select className="search" value={owner} onChange={(e) => setOwner(e.target.value as Owner)} aria-label="Cine">
          {OWNERS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <input className="search" type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Termen" />
        <select className="search" value={siteId} onChange={(e) => setSiteId(e.target.value)} aria-label="Site">
          <option value="">fără site</option>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button className="primary" type="submit" disabled={!title.trim()}>+ adaugă</button>
      </form>

      <section className="toolbar">
        <div className="tabs" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} className={filter === f.id ? 'on' : ''} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      </section>

      {error && <p className="err">{error}</p>}

      {todos === null ? <p className="dim pad">se încarcă…</p> : shown.length === 0 ? (
        <div className="empty"><p>{filter === 'gata' ? 'Nimic bifat încă.' : 'Nimic de făcut aici.'}</p></div>
      ) : (
        <ul className="todo-list">
          {shown.map((t) => {
            const d = t.due ? dueLabel(t.due) : null;
            return (
              <li key={t.id} className={`todo${t.done ? ' done' : ''}`}>
                <input type="checkbox" checked={t.done} onChange={(e) => update(t, { done: e.target.checked })} aria-label={`Gata: ${t.title}`} />
                <div className="todo-main">
                  <input
                    className="todo-text" defaultValue={t.title} aria-label="Titlu"
                    onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== t.title) update(t, { title: v }); }}
                  />
                  <div className="todo-meta small">
                    <span className="dim">{ownerLabel(t.owner)}</span>
                    {t.site_id && siteName.get(t.site_id) && <span className="todo-site">{siteName.get(t.site_id)}</span>}
                    {d && <span className={`todo-due ${t.done ? '' : d.cls}`}>{d.text}</span>}
                  </div>
                </div>
                <button className="todo-del" onClick={() => remove(t)} aria-label={`Șterge ${t.title}`} title="Șterge">×</button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
