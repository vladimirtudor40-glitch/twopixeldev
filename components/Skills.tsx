'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { listCol, saveItem } from '@/lib/backend';
import { SKILL_STATUSES, type Skill, type SkillStatus } from '@/lib/types';

export default function Skills({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<SkillStatus | 'toate'>('toate');
  const [cat, setCat] = useState('toate');
  const [q, setQ] = useState('');
  const [hideComposio, setHideComposio] = useState(true);

  const load = useCallback(async () => {
    try { setSkills(await listCol<Skill>('skills')); setError(''); }
    catch (e) {
      if (e instanceof Error && e.message === 'unauthorized') onUnauthorized();
      else setError(e instanceof Error ? e.message : 'Eroare la încărcare');
    }
  }, [onUnauthorized]);
  useEffect(() => { load(); }, [load]);

  const categories = useMemo(() => {
    const set = new Set((skills ?? []).map((s) => s.category).filter((c) => !hideComposio || !c.startsWith('Composio')));
    return ['toate', ...set];
  }, [skills, hideComposio]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (skills ?? []).filter((s) =>
      (!hideComposio || !s.category.startsWith('Composio') || s.status !== 'neevaluat' || filter !== 'toate') &&
      (filter === 'toate' || s.status === filter) &&
      (cat === 'toate' || s.category === cat) &&
      (!term || [s.name, s.description, s.category, s.notes].some((v) => v?.toLowerCase().includes(term))));
  }, [skills, filter, cat, q, hideComposio]);

  const count = (st: SkillStatus) => (skills ?? []).filter((s) => s.status === st).length;

  async function update(s: Skill, patch: Partial<Skill>) {
    setSkills((p) => p?.map((x) => (x.id === s.id ? { ...x, ...patch } : x)) ?? p);
    try { await saveItem('skills', patch, s.id); } catch { await load(); }
  }

  return (
    <>
      <section className="stats" aria-label="Rezumat skill-uri">
        <div className="stat"><span className="stat-v">{skills?.length ?? 0}</span><span className="stat-l">în listă</span></div>
        <div className="stat cyan"><span className="stat-v">{count('instalat')}</span><span className="stat-l">instalate</span></div>
        <div className="stat magenta"><span className="stat-v">{count('de_incercat')}</span><span className="stat-l">de încercat</span></div>
        <div className="stat"><span className="stat-v">{count('avem_deja')}</span><span className="stat-l">avem deja</span></div>
        <div className="stat"><span className="stat-v">{count('neevaluat')}</span><span className="stat-l">neevaluate</span></div>
      </section>

      <section className="toolbar">
        <div className="tabs" role="tablist">
          {[{ id: 'toate', label: 'Toate' } as const, ...SKILL_STATUSES].map((t) => (
            <button key={t.id} role="tab" aria-selected={filter === t.id} className={filter === t.id ? 'on' : ''} onClick={() => setFilter(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="toolbar-right">
          <select className="search" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categorie">
            {categories.map((c) => <option key={c} value={c}>{c === 'toate' ? 'toate categoriile' : c}</option>)}
          </select>
          <input className="search" placeholder="caută…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Caută skill-uri" />
        </div>
      </section>
      <label className="check small dim">
        <input type="checkbox" checked={hideComposio} onChange={(e) => setHideComposio(e.target.checked)} /> ascunde automatizările Composio neevaluate (cer cont Composio)
      </label>

      {error && <p className="err">{error}</p>}

      {skills === null ? <p className="dim pad">se încarcă…</p> : shown.length === 0 ? (
        <div className="empty"><p>Nimic pentru filtrul ăsta.</p></div>
      ) : (
        <ul className="skill-list">
          {shown.map((s) => (
            <li key={s.id} className="skill">
              <div className="skill-main">
                <div className="skill-title">
                  {s.url && /^https?:\/\//i.test(s.url) ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a> : <b>{s.name}</b>}
                  <span className="dim small">{s.category}</span>
                </div>
                {s.description && <p className="small">{s.description}</p>}
                <input
                  className="skill-note small" placeholder="notă…" defaultValue={s.notes ?? ''} aria-label={`Notă pentru ${s.name}`}
                  onBlur={(e) => e.target.value !== (s.notes ?? '') && update(s, { notes: e.target.value })}
                />
              </div>
              <select className={`badge-select ss-${s.status}`} value={s.status} onChange={(e) => update(s, { status: e.target.value as SkillStatus })} aria-label={`Status ${s.name}`}>
                {SKILL_STATUSES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </select>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
