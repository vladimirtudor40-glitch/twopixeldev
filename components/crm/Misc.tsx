'use client';

import { useState } from 'react';
import { deleteSite, saveSite } from '@/lib/backend';
import { CATEGORIES, PACKAGES, PLANS, RESALE, RULES, EXTRAS, priceText } from '@/lib/pricing';
import { STATUSES, daysLeft, ownerLabel, statusLabel, type Site, type SiteInput, type Status } from '@/lib/types';
import SiteForm from '../SiteForm';
import { Ring } from './Charts';
import Icon from './Icons';
import { Empty, PageHead, Pills, Search, dateRo, money } from './ui';
import type { Crm, Data } from './store';

// ---------- Site-uri ----------
export function Sites({ data, crm }: { data: Data; crm: Crm }) {
  const [filter, setFilter] = useState<Status | 'toate'>('toate');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Site | 'new' | null>(null);
  const term = q.trim().toLowerCase();
  const shown = data.sites.filter((s) => (filter === 'toate' || s.status === filter) &&
    (!term || [s.name, s.client_name, s.domain, s.hosting, s.notes].some((v) => v?.toLowerCase().includes(term))));

  async function onSave(input: SiteInput, id?: string) { await saveSite(input, id); setEditing(null); await crm.load(); }
  async function onDelete(id: string) { await deleteSite(id); setEditing(null); await crm.load(); }

  return (
    <div className="view">
      <PageHead title="Site-uri" sub={`${data.sites.length} site-uri administrate.`}>
        <Search value={q} onChange={setQ} placeholder="caută site…" />
        <button className="primary" onClick={() => setEditing('new')}><Icon name="plus" size={16} />site nou</button>
      </PageHead>
      <Pills label="Filtru site-uri" value={filter} onChange={setFilter}
        items={[{ id: 'toate', label: 'Toate', count: data.sites.length }, ...STATUSES.map((s) => ({ ...s, count: data.sites.filter((x) => x.status === s.id).length }))]} />
      {shown.length === 0 ? <Empty icon="globe" text={data.sites.length ? 'Nimic pentru filtrul ăsta.' : 'Niciun site încă.'} /> : (
        <ul className="cards">
          {shown.map((s, i) => {
            const d = daysLeft(s.domain_expires);
            const zone = s.notes?.split('\n')[0];
            return (
              <li key={s.id} style={{ animationDelay: `${Math.min(i, 20) * 30}ms` }}>
                <button className="card" onClick={() => setEditing(s)}>
                  <div className="card-head">
                    <span className={`badge st-${s.status}`}>{statusLabel(s.status)}</span>
                    <span className="dim small">{ownerLabel(s.owner)}</span>
                  </div>
                  <div className="site-thumb" aria-hidden><span>{s.name.slice(0, 1).toUpperCase()}</span><i /><i /><i /></div>
                  <h3>{s.name}</h3>
                  <p className="dim small ellipsis">{s.client_name || zone || '—'}</p>
                  <dl>
                    <div><dt>domeniu</dt><dd>{s.domain || (s.live_url ? s.live_url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '—')}</dd></div>
                    <div><dt>expiră</dt><dd className={d !== null && d <= 30 ? 'warn' : ''}>{s.domain_expires ? (d! < 0 ? `expirat` : `${d} zile`) : '—'}</dd></div>
                  </dl>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {editing && <SiteForm site={editing === 'new' ? null : editing} onCancel={() => setEditing(null)} onSave={onSave} onDelete={onDelete} />}
    </div>
  );
}

// ---------- Domenii ----------
export function Domains({ data, crm }: { data: Data; crm: Crm }) {
  const [editing, setEditing] = useState<Site | null>(null);
  const rows = data.sites.filter((s) => s.domain || s.domain_expires)
    .map((s) => ({ s, d: daysLeft(s.domain_expires) }))
    .sort((a, b) => (a.d ?? 99999) - (b.d ?? 99999));
  const withoutDomain = data.sites.filter((s) => !s.domain).length;

  async function onSave(input: SiteInput, id?: string) { await saveSite(input, id); setEditing(null); await crm.load(); }
  async function onDelete(id: string) { await deleteSite(id); setEditing(null); await crm.load(); }

  return (
    <div className="view">
      <PageHead title="Domenii" sub={`Expirările din fișa fiecărui site. ${withoutDomain} site-uri sunt doar pe GitHub Pages, fără domeniu propriu.`} />
      <div className="kpis">
        <div className="kpi c2"><b>{rows.filter((r) => r.d !== null && r.d <= 30).length}</b><span>expiră în 30 de zile</span></div>
        <div className="kpi c3"><b>{rows.filter((r) => r.d !== null && r.d > 30 && r.d <= 90).length}</b><span>în 31–90 de zile</span></div>
        <div className="kpi c1"><b>{rows.length}</b><span>domenii urmărite</span></div>
      </div>
      {rows.length === 0 ? (
        <Empty icon="domain" text="Niciun domeniu cu dată de expirare. Completează „domeniu” și „expiră la” în fișa site-ului." />
      ) : (
        <ul className="dlist">
          {rows.map(({ s, d }, i) => {
            const color = d === null ? 'var(--ink-3)' : d <= 30 ? 'var(--c2)' : d <= 90 ? 'var(--amber)' : 'var(--c1)';
            return (
              <li key={s.id} style={{ animationDelay: `${i * 35}ms` }}>
                <button className="panel drow" onClick={() => setEditing(s)}>
                  <Ring value={d === null ? 0 : Math.max(0, 1 - d / 365)} color={color} size={52}><b>{d === null ? '?' : d < 0 ? '!' : d}</b></Ring>
                  <span className="drow-m"><b>{s.domain || '—'}</b><span className="dim small">{s.name} · {s.hosting || 'hosting necompletat'}</span></span>
                  <span className={`small ${d !== null && d <= 30 ? 'warn' : 'dim'}`}>{s.domain_expires ? (d! < 0 ? `expirat de ${-d!} zile` : `expiră ${dateRo(s.domain_expires)}`) : 'fără dată'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {editing && <SiteForm site={editing} onCancel={() => setEditing(null)} onSave={onSave} onDelete={onDelete} />}
    </div>
  );
}

// ---------- Prețuri ----------
export function Prices({ onUse }: { onUse: (pkgId: string) => void }) {
  return (
    <div className="view">
      <PageHead title="Listă de prețuri" sub="Prețuri de pornire, fără TVA. Alege un pachet ca să deschizi direct un proiect nou cu el." />
      <ul className="rules">{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
      {CATEGORIES.map((c, ci) => {
        const pk = PACKAGES.filter((p) => p.category === c.id && p.id !== 'custom');
        if (!pk.length) return null;
        return (
          <section key={c.id} className="price-sec" style={{ animationDelay: `${ci * 70}ms` }}>
            <h2><i style={{ background: c.color }} />{c.label}</h2>
            <ul className="price-grid">
              {pk.map((p) => (
                <li key={p.id} className="panel price">
                  <b>{p.name}</b>
                  <span className="price-v">{priceText(p)}</span>
                  <span className="dim small">{[p.term, p.min ? `minim ${money(p.min)}` : null].filter(Boolean).join(' · ')}</span>
                  <p className="small">{p.includes}</p>
                  <button className="ghost" onClick={() => onUse(p.id)}>folosește în proiect<Icon name="chevron" size={14} /></button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <section className="price-sec">
        <h2><i style={{ background: 'var(--c7)' }} />Mentenanță lunară</h2>
        <ul className="price-grid">
          {PLANS.map((p) => (
            <li key={p.id} className="panel price">
              <b>{p.name}</b><span className="price-v">{p.monthly} RON / lună</span>
              <span className="dim small">{p.fits}</span><p className="small">{p.includes}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="ov-row">
        <section className="panel">
          <header className="panel-h"><h2>Extra</h2></header>
          <ul className="kv">{EXTRAS.map((e) => <li key={e.id}><span>{e.name}</span><b>{e.unit ? `${e.unit} RON / ${e.per}` : `+${e.pct}%`}</b></li>)}</ul>
        </section>
        <section className="panel">
          <header className="panel-h"><h2>Revânzare</h2></header>
          <ul className="kv">{RESALE.map((e) => <li key={e.name}><span>{e.name}</span><b>{e.price}</b></li>)}</ul>
        </section>
      </div>
    </div>
  );
}
