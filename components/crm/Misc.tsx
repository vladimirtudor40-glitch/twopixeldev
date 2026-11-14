'use client';

import { useEffect, useRef, useState } from 'react';
import { deleteSite, importItems, saveSite } from '@/lib/backend';
import { leadNotes, planImport, type ImportPlan } from '@/lib/leadsImport';
import { CATEGORIES, PACKAGES, PLANS, RESALE, RULES, EXTRAS, priceText } from '@/lib/pricing';
import { RESPONSES, daysLeft, emptySite, type OfferResponse, type Site, type SiteInput } from '@/lib/types';
import SiteForm from '../SiteForm';
import { Ring } from './Charts';
import Icon from './Icons';
import { Empty, PageHead, Pills, Search, dateRo, money } from './ui';
import type { Crm, Data } from './store';

// ---------- Site-uri: monitorizare clienți & oferte ----------
type Filter = 'toate' | 'necontactati' | 'contactati' | OfferResponse;
const OFFER_TYPES = ['Black Friday 50%'];
const href = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

export function Sites({ data, crm }: { data: Data; crm: Crm }) {
  const [filter, setFilter] = useState<Filter>('toate');
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState('');
  const rows = data.sites;
  const term = q.trim().toLowerCase();
  const count = (f: Filter) => rows.filter((s) => match(s, f)).length;
  const shown = rows.filter((s) => match(s, filter) &&
    (!term || [s.name, s.client_phone, s.client_email, s.notes, s.offer_type].some((v) => v?.toLowerCase().includes(term))));

  async function patch(id: string, p: Partial<Site>) {
    try { setErr(''); await crm.save('sites', p, id); } catch (e) { setErr(e instanceof Error ? e.message : 'Nu s-a putut salva'); }
  }
  async function add() {
    setAdding(true);
    try {
      setErr('');
      await crm.save('sites', { ...emptySite(), status: 'oferta', maps_url: '', demo_url: '', contacted: false, response: '', offer_type: 'Black Friday 50%' });
    } catch (e) { setErr(e instanceof Error ? e.message : 'Nu s-a putut adăuga'); }
    setAdding(false);
  }

  return (
    <div className="view">
      <PageHead title="Site-uri" sub="Monitorizare clienți & oferte. Modifici direct în tabel, se salvează singur.">
        <Search value={q} onChange={setQ} placeholder="caută client…" />
        <ImportLeads data={data} crm={crm} />
        <button className="primary" onClick={add} disabled={adding}><Icon name="plus" size={16} />client nou</button>
      </PageHead>
      <div className="kpis">
        <div className="kpi c1"><b>{rows.length}</b><span>Total clienți</span></div>
        <div className="kpi c1"><b>{count('contactati')}</b><span>Contactați</span></div>
        <div className="kpi green"><b>{count('acceptat')}</b><span>Oferte acceptate</span></div>
        <div className="kpi amber"><b>{count('in_decizie')}</b><span>În decizie</span></div>
      </div>
      <Pills label="Filtru clienți" value={filter} onChange={setFilter}
        items={[
          { id: 'toate', label: 'Toți', count: rows.length },
          { id: 'necontactati', label: 'Necontactați', count: count('necontactati') },
          { id: 'contactati', label: 'Contactați', count: count('contactati') },
          ...RESPONSES.map((r) => ({ id: r.id, label: r.label, count: count(r.id) })),
        ]} />
      {err && <p className="err">{err}</p>}
      {shown.length === 0 ? (
        <Empty icon="globe" text={rows.length ? 'Nimic pentru filtrul ăsta.' : 'Niciun client încă.'}>
          {!rows.length && <button className="primary" onClick={add} disabled={adding}><Icon name="plus" size={16} />adaugă primul client</button>}
        </Empty>
      ) : (
        <div className="panel sheet-wrap">
          <table className="sheet">
            <colgroup>
              <col className="w-client" /><col className="w-tel" /><col className="w-mail" /><col className="w-link" /><col className="w-link" />
              <col className="w-chk" /><col className="w-resp" /><col className="w-obs" /><col className="w-tip" /><col className="w-del" />
            </colgroup>
            <thead>
              <tr>
                <th>Client</th><th>Telefon</th><th>Email</th><th title="Link Google Maps">Maps</th><th title="Link site demo">Demo</th>
                <th className="c" title="Contactat">Contact.</th><th>Răspuns</th><th>Observații</th><th>Tip ofertă</th><th aria-label="Acțiuni" />
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => <SheetRow key={s.id} s={s} onPatch={(p) => patch(s.id, p)} onDelete={() => crm.remove('sites', s.id)} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** „Importă leaduri”: reads a google-maps-scraper CSV, keeps businesses without a website, skips duplicates. */
function ImportLeads({ data, crm }: { data: Data; crm: Crm }) {
  const input = useRef<HTMLInputElement>(null);
  const [plan, setPlan] = useState<(ImportPlan & { file: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function pick(f: File | undefined) {
    if (!f) return;
    setMsg('');
    try { setPlan({ ...planImport(await f.text(), data.sites), file: f.name }); }
    catch (e) { setPlan(null); setMsg(e instanceof Error ? e.message : 'Nu am putut citi fișierul.'); }
    if (input.current) input.current.value = '';
  }
  async function run() {
    if (!plan?.leads.length) return;
    setBusy(true);
    try {
      const n = await importItems('sites', plan.leads.map((l) => ({
        ...emptySite(), status: 'oferta', name: l.name, client_phone: l.phone, client_email: l.email,
        maps_url: l.maps_url, demo_url: '', contacted: false, response: '', offer_type: 'Black Friday 50%', notes: leadNotes(l),
      })));
      await crm.load();
      setPlan(null);
      setMsg(`Am adăugat ${n} ${n === 1 ? 'client' : 'clienți'} în tabel.`);
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Importul a eșuat.'); }
    setBusy(false);
  }

  return (
    <>
      <input ref={input} type="file" accept=".csv,text/csv" hidden onChange={(e) => pick(e.target.files?.[0])} />
      <button className="ghost" onClick={() => input.current?.click()} disabled={busy}>
        <Icon name="plus" size={14} />importă leaduri
      </button>
      {(plan || msg) && (
        <div className="imp-box" role="status">
          {plan ? (
            <>
              <p><b>{plan.file}</b>: {plan.total} firme găsite.</p>
              <ul>
                <li>{plan.withSite} au deja site (sărite)</li>
                {plan.closed > 0 && <li>{plan.closed} închise definitiv (sărite)</li>}
                <li>{plan.duplicates} sunt deja în tabel (sărite)</li>
                <li><b>{plan.leads.length} fără site, noi</b></li>
              </ul>
              <div className="imp-act">
                <button className="primary" onClick={run} disabled={busy || !plan.leads.length}>
                  {busy ? 'se importă…' : `importă ${plan.leads.length}`}
                </button>
                <button className="ghost" onClick={() => setPlan(null)} disabled={busy}>anulează</button>
              </div>
            </>
          ) : (
            <div className="imp-act"><p>{msg}</p><button className="ghost" onClick={() => setMsg('')}>ok</button></div>
          )}
        </div>
      )}
    </>
  );
}

function match(s: Site, f: Filter) {
  if (f === 'toate') return true;
  if (f === 'contactati') return !!s.contacted;
  if (f === 'necontactati') return !s.contacted;
  return s.response === f;
}

/** One editable row: text cells save on blur, checkbox and dropdown save at once. */
function SheetRow({ s, onPatch, onDelete }: { s: Site; onPatch: (p: Partial<Site>) => Promise<void>; onDelete: () => Promise<void> }) {
  const [contacted, setContacted] = useState(!!s.contacted);
  const [response, setResponse] = useState<string>(s.response || '');
  const [offer, setOffer] = useState(s.offer_type || '');
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { setContacted(!!s.contacted); setResponse(s.response || ''); setOffer(s.offer_type || ''); }, [s.contacted, s.response, s.offer_type]);

  return (
    <tr className={response ? `rs-${response}` : ''}>
      <td><Cell value={s.name} field="name" onPatch={onPatch} placeholder="nume client" strong /></td>
      <td><Cell value={s.client_phone} field="client_phone" onPatch={onPatch} type="tel" placeholder="07…" /></td>
      <td><Cell value={s.client_email} field="client_email" onPatch={onPatch} type="email" placeholder="email" /></td>
      <td><Cell value={s.maps_url} field="maps_url" onPatch={onPatch} placeholder="link" link /></td>
      <td><Cell value={s.demo_url} field="demo_url" onPatch={onPatch} placeholder="link" link /></td>
      <td className="c">
        <input type="checkbox" className="sheet-check" checked={contacted} aria-label={`Contactat: ${s.name}`}
          onChange={(e) => { setContacted(e.target.checked); onPatch({ contacted: e.target.checked }); }} />
      </td>
      <td>
        <select className="sheet-sel" value={response} aria-label={`Răspuns: ${s.name}`}
          onChange={(e) => { setResponse(e.target.value); onPatch({ response: e.target.value as OfferResponse | '' }); }}>
          <option value="">—</option>
          {RESPONSES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </td>
      <td><Cell value={s.notes} field="notes" onPatch={onPatch} placeholder="observații" wide /></td>
      <td>
        <select className="sheet-sel" value={offer} aria-label={`Tip ofertă: ${s.name}`}
          onChange={(e) => { setOffer(e.target.value); onPatch({ offer_type: e.target.value }); }}>
          <option value="">—</option>
          {(offer && !OFFER_TYPES.includes(offer) ? [offer, ...OFFER_TYPES] : OFFER_TYPES).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </td>
      <td className="c">
        {confirm
          ? <button className="sheet-del on" onClick={onDelete} onBlur={() => setConfirm(false)}>sigur?</button>
          : <button className="sheet-del" onClick={() => setConfirm(true)} aria-label={`Șterge ${s.name}`}>×</button>}
      </td>
    </tr>
  );
}

function Cell({ value, field, onPatch, placeholder, type = 'text', link, strong, wide, list }: {
  value: string | null | undefined; field: keyof Site; onPatch: (p: Partial<Site>) => Promise<void>;
  placeholder?: string; type?: string; link?: boolean; strong?: boolean; wide?: boolean; list?: string;
}) {
  const [v, setV] = useState(value ?? '');
  useEffect(() => { setV(value ?? ''); }, [value]);
  const commit = () => { const t = v.trim(); if (t !== (value ?? '')) onPatch({ [field]: t } as Partial<Site>); };
  return (
    <span className={`sheet-cell${wide ? ' wide' : ''}${strong ? ' strong' : ''}`}>
      <input type={type} size={1} value={v} placeholder={placeholder} list={list} aria-label={placeholder}
        onChange={(e) => setV(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') { setV(value ?? ''); } }} />
      {link && value && <a href={href(value)} target="_blank" rel="noopener noreferrer" aria-label="deschide link"><Icon name="link" size={14} /></a>}
    </span>
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
