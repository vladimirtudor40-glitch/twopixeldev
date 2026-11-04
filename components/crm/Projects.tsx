'use client';

import { useMemo, useState } from 'react';
import {
  CATEGORIES, EXTRAS, PACKAGES, PLANS, categoryLabel, installments, packageById, planById, priceText, quote,
  type Category, type ExtraLine,
} from '@/lib/pricing';
import {
  OWNERS, PROJECT_STATUSES, daysLeft, emptyClient, emptyProject, projectStatusLabel,
  type Project, type ProjectInput, type ProjectStatus,
} from '@/lib/types';
import { CountUp } from './Charts';
import Icon from './Icons';
import { Avatar, Drawer, Empty, Field, PageHead, Pills, Search, Select, dateRo, money } from './ui';
import { paidOf, type Crm, type Data } from './store';

type Filter = 'active' | 'oferta' | 'livrat' | 'toate';

export default function Projects({ data, crm, onOpen }: { data: Data; crm: Crm; onOpen: (p: Project | 'new') => void }) {
  const [filter, setFilter] = useState<Filter>('active');
  const [q, setQ] = useState('');
  const clientName = useMemo(() => new Map(data.clients.map((c) => [c.id, c.name])), [data.clients]);

  const groups: Record<Filter, (s: ProjectStatus) => boolean> = {
    active: (s) => s === 'in_lucru' || s === 'review',
    oferta: (s) => s === 'oferta',
    livrat: (s) => s === 'livrat' || s === 'mentenanta',
    toate: () => true,
  };
  const shown = data.projects.filter((p) => groups[filter](p.status) &&
    (!q.trim() || [p.name, clientName.get(p.client_id ?? ''), packageById(p.package_id)?.name, p.notes].some((v) => v?.toLowerCase().includes(q.trim().toLowerCase()))));

  const sold = data.projects.filter((p) => !['oferta', 'anulat'].includes(p.status));
  const totalSold = sold.reduce((s, p) => s + p.price, 0);
  const totalPaid = sold.reduce((s, p) => s + paidOf(data.payments, p.id), 0);
  const offers = data.projects.filter((p) => p.status === 'oferta').reduce((s, p) => s + p.price, 0);

  return (
    <div className="view">
      <PageHead title="Proiecte" sub="Fiecare proiect pornește dintr-un pachet din lista de prețuri.">
        <Search value={q} onChange={setQ} placeholder="caută proiect…" />
        <button className="primary" onClick={() => onOpen('new')}><Icon name="plus" size={16} />proiect nou</button>
      </PageHead>

      <div className="kpis">
        <Kpi label="vândut" value={totalSold} />
        <Kpi label="încasat" value={totalPaid} tone="c1" />
        <Kpi label="rest de încasat" value={Math.max(0, totalSold - totalPaid)} tone="c2" />
        <Kpi label="oferte deschise" value={offers} tone="c3" />
      </div>

      <Pills label="Filtru proiecte" value={filter} onChange={setFilter} items={[
        { id: 'active', label: 'În lucru', count: data.projects.filter((p) => groups.active(p.status)).length },
        { id: 'oferta', label: 'Oferte', count: data.projects.filter((p) => groups.oferta(p.status)).length },
        { id: 'livrat', label: 'Livrate', count: data.projects.filter((p) => groups.livrat(p.status)).length },
        { id: 'toate', label: 'Toate', count: data.projects.length },
      ]} />

      {shown.length === 0 ? (
        <Empty icon="folder" text={data.projects.length ? 'Nimic pentru filtrul ăsta.' : 'Niciun proiect încă. Alege un pachet și începe.'}>
          <button className="primary" onClick={() => onOpen('new')}><Icon name="plus" size={16} />proiect nou</button>
        </Empty>
      ) : (
        <ul className="cards">
          {shown.map((p, i) => {
            const paid = paidOf(data.payments, p.id);
            const pct = p.price ? Math.min(100, (paid / p.price) * 100) : 0;
            const d = daysLeft(p.deadline);
            const who = clientName.get(p.client_id ?? '') ?? '';
            return (
              <li key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
                <button className="card" onClick={() => onOpen(p)}>
                  <div className="card-head">
                    <span className={`badge ps-${p.status}`}>{projectStatusLabel(p.status)}</span>
                    <span className="dim small">{categoryLabel(p.category)}</span>
                  </div>
                  <div className="card-title">
                    <Avatar name={who || p.name} size={40} />
                    <div><h3>{p.name}</h3><p className="dim small">{who || 'fără client'} · {packageById(p.package_id)?.name ?? 'personalizat'}</p></div>
                  </div>
                  <div className="money-row">
                    <b>{money(p.price, p.currency)}</b>
                    <span className="dim small">{paid >= p.price && p.price ? 'încasat integral' : `${money(paid)} încasat`}</span>
                  </div>
                  <span className="bar-mini"><i style={{ width: `${pct}%` }} /></span>
                  <dl>
                    <div><dt>progres</dt><dd>{p.progress}%</dd></div>
                    <div><dt>termen</dt><dd className={d !== null && d < 7 && !['livrat', 'mentenanta'].includes(p.status) ? 'warn' : ''}>{p.deadline ? dateRo(p.deadline, { day: 'numeric', month: 'short' }) : '—'}</dd></div>
                    <div><dt>mentenanță</dt><dd>{p.plan_id ? `${money(p.plan_monthly)}/lună` : '—'}</dd></div>
                  </dl>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return <div className={`kpi ${tone ?? ''}`}><b><CountUp value={value} format={(n) => money(n)} /></b><span>{label}</span></div>;
}

// ---------- form ----------

export function ProjectForm({ project, data, crm, onClose, preset, initialClient }: {
  project: Project | null; data: Data; crm: Crm; onClose: () => void; preset?: string; initialClient?: string;
}) {
  const [v, setV] = useState<ProjectInput>(() => {
    if (project) {
      const { id: _i, created_at: _c, updated_at: _u, updated_by: _b, ...rest } = project;
      return { ...emptyProject(), ...rest };
    }
    const base = { ...emptyProject(), client_id: initialClient ?? null };
    const pkg = packageById(preset);
    if (pkg) {
      const plan = planById(pkg.plan);
      return { ...base, category: pkg.category, package_id: pkg.id, base_price: pkg.price, price: pkg.price, plan_id: plan?.id ?? null, plan_monthly: plan?.monthly ?? 0 };
    }
    return base;
  });
  const [manualPrice, setManualPrice] = useState(!!project);
  const [newClient, setNewClient] = useState('');
  const [makeInstallments, setMakeInstallments] = useState(!project);

  const pkg = packageById(v.package_id);
  const calc = quote(v.package_id, v.base_price, v.extras, v.urgent, v.discount);
  const price = manualPrice ? v.price : calc;

  const set = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) => setV((p) => ({ ...p, [k]: val }));

  function pickCategory(c: Category) {
    const first = PACKAGES.find((p) => p.category === c)!;
    pickPackage(first.id, c);
  }
  function pickPackage(id: string, c = v.category) {
    const p = packageById(id);
    const plan = planById(p?.plan);
    setV((x) => ({ ...x, category: c, package_id: id, base_price: p?.price ?? 0, plan_id: plan?.id ?? x.plan_id, plan_monthly: plan?.monthly ?? x.plan_monthly }));
    setManualPrice(false);
  }
  function setExtra(id: string, qty: number) {
    setV((x) => {
      const rest = x.extras.filter((e) => e.id !== id);
      return { ...x, extras: qty > 0 ? [...rest, { id, qty } as ExtraLine] : rest };
    });
  }
  const qty = (id: string) => v.extras.find((e) => e.id === id)?.qty ?? 0;

  async function submit() {
    let client_id = v.client_id;
    if (client_id === '__new' && newClient.trim()) {
      const c = await crm.save<{ id: string }>('clients', { ...emptyClient(), name: newClient.trim(), owner: v.owner });
      client_id = c.id;
    } else if (client_id === '__new') client_id = null;
    const input: ProjectInput = { ...v, client_id, price };
    const saved = await crm.save<{ id: string }>('projects', input, project?.id);
    if (!project && makeInstallments && price > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const parts = installments(price);
      let left = price;
      for (let i = 0; i < parts.length; i++) {
        const amount = i === parts.length - 1 ? left : Math.round((price * parts[i].pct) / 100);
        left -= amount;
        await crm.save('payments', {
          project_id: saved.id, client_id, label: `${parts[i].label} ${parts[i].pct}%`, amount, currency: v.currency,
          kind: i === 0 ? 'avans' : i === parts.length - 1 ? 'final' : 'transa', paid: false,
          date: i === 0 ? today : v.deadline || null, invoice: '', notes: '',
        });
      }
    }
    onClose();
  }

  const below = pkg?.min && price < pkg.min;
  const parts = installments(price);

  return (
    <Drawer title={project ? project.name : 'proiect nou'} onClose={onClose} onSubmit={submit} wide
      onDelete={project ? async () => { await crm.remove('projects', project.id); onClose(); } : undefined}>
      <fieldset><legend>proiect</legend>
        <Field label="nume proiect"><input required autoFocus={!project} value={v.name} onChange={(e) => set('name', e.target.value)} placeholder="ex. Site Pensiunea Bran" /></Field>
        <div className="row">
          <Field label="client">
            <Select value={v.client_id ?? ''} onChange={(x) => set('client_id', x || null)} empty="— fără client —"
              options={[...data.clients.map((c) => ({ id: c.id, label: c.company ? `${c.name} · ${c.company}` : c.name })), { id: '__new', label: '+ client nou…' }]} />
          </Field>
          <Field label="site legat">
            <Select value={v.site_id ?? ''} onChange={(x) => set('site_id', x || null)} empty="—" options={data.sites.map((s) => ({ id: s.id, label: s.name }))} />
          </Field>
        </div>
        {v.client_id === '__new' && <Field label="nume client nou"><input value={newClient} onChange={(e) => setNewClient(e.target.value)} placeholder="Nume sau firmă" /></Field>}
      </fieldset>

      <fieldset><legend>pachet din lista de prețuri</legend>
        <div className="seg" role="radiogroup" aria-label="Categorie">
          {CATEGORIES.map((c) => (
            <button type="button" key={c.id} role="radio" aria-checked={v.category === c.id} className={v.category === c.id ? 'on' : ''} onClick={() => pickCategory(c.id)}>
              <i style={{ background: c.color }} />{c.label}
            </button>
          ))}
        </div>
        <div className="pkgs">
          {PACKAGES.filter((p) => p.category === v.category).map((p) => (
            <button type="button" key={p.id} className={`pkg${v.package_id === p.id ? ' on' : ''}`} onClick={() => pickPackage(p.id)}>
              <b>{p.name}</b>
              <span className="pkg-p">{priceText(p)}</span>
              {p.term && <span className="dim small">{p.term}</span>}
            </button>
          ))}
        </div>
        {pkg && <p className="pkg-inc small"><Icon name="check" size={14} />{pkg.includes}</p>}
        <div className="row">
          <Field label={pkg?.max ? `preț de bază (${pkg.price.toLocaleString('ro-RO')}–${pkg.max.toLocaleString('ro-RO')})` : 'preț de bază'}>
            <input type="number" min={0} step={50} value={v.base_price} onChange={(e) => { set('base_price', Number(e.target.value)); setManualPrice(false); }} />
          </Field>
          <Field label="monedă"><Select value={v.currency} onChange={(x) => set('currency', x)} options={[{ id: 'RON', label: 'RON' }, { id: 'EUR', label: 'EUR' }]} /></Field>
        </div>
      </fieldset>

      <fieldset><legend>extra</legend>
        <div className="extras">
          {EXTRAS.map((e) => (
            <label key={e.id} className={`extra${qty(e.id) ? ' on' : ''}`}>
              <span><b>{e.name}</b><em>{e.unit ? `${e.unit} RON / ${e.per}` : `+${e.pct}% / ${e.per}`}</em></span>
              <input type="number" min={0} value={qty(e.id) || ''} placeholder="0" onChange={(x) => { setExtra(e.id, Number(x.target.value)); setManualPrice(false); }} aria-label={`${e.name}, cantitate`} />
            </label>
          ))}
        </div>
        <div className="row">
          <label className="check"><input type="checkbox" checked={v.urgent} onChange={(e) => { set('urgent', e.target.checked); setManualPrice(false); }} /><span>Urgență <em>+25%</em></span></label>
          <Field label="discount %">
            <input type="number" min={0} max={30} value={v.discount || ''} placeholder="0" onChange={(e) => { set('discount', Number(e.target.value)); setManualPrice(false); }} />
          </Field>
        </div>
        {v.discount > 10 && <p className="warn small">Lista spune maximum 10%, și doar în schimbul a ceva.</p>}
      </fieldset>

      <div className="total">
        <div>
          <span className="dim small">total ofertat, fără TVA</span>
          <input className="total-v" type="number" min={0} step={10} value={price} onChange={(e) => { set('price', Number(e.target.value)); setManualPrice(true); }} aria-label="Preț final" />
          {manualPrice && price !== calc && <button type="button" className="link-btn inline" onClick={() => setManualPrice(false)}>folosește calculul: {money(calc)}</button>}
        </div>
        <div className="total-r small">
          {below && <p className="warn">Sub prețul minim al pachetului ({money(pkg!.min!)}).</p>}
          <p className="dim">Plată: {parts.map((x) => `${x.pct}% ${x.label.toLowerCase()}`).join(' · ')}</p>
          <p className="dim">≈ {Math.round(price / 5.1).toLocaleString('ro-RO')} EUR</p>
        </div>
      </div>

      <fieldset><legend>mentenanță după lansare</legend>
        <div className="row">
          <Field label="abonament">
            <Select value={v.plan_id ?? ''} onChange={(x) => { const p = planById(x); setV((s) => ({ ...s, plan_id: x || null, plan_monthly: p?.monthly ?? 0 })); }} empty="fără abonament"
              options={PLANS.map((p) => ({ id: p.id, label: `${p.name} · ${p.monthly} RON/lună` }))} />
          </Field>
          <Field label="RON / lună"><input type="number" min={0} value={v.plan_monthly} onChange={(e) => set('plan_monthly', Number(e.target.value))} /></Field>
        </div>
        {planById(v.plan_id) && <p className="dim small">{planById(v.plan_id)!.includes}</p>}
      </fieldset>

      <fieldset><legend>status</legend>
        <div className="row">
          <Field label="status"><Select value={v.status} onChange={(x) => set('status', x as ProjectStatus)} options={PROJECT_STATUSES} /></Field>
          <Field label="cine lucrează"><Select value={v.owner} onChange={(x) => set('owner', x as ProjectInput['owner'])} options={OWNERS} /></Field>
        </div>
        <div className="row">
          <Field label="start"><input type="date" value={v.start ?? ''} onChange={(e) => set('start', e.target.value || null)} /></Field>
          <Field label="termen"><input type="date" value={v.deadline ?? ''} onChange={(e) => set('deadline', e.target.value || null)} /></Field>
        </div>
        <Field label={`progres · ${v.progress}%`}><input type="range" min={0} max={100} step={5} value={v.progress} onChange={(e) => set('progress', Number(e.target.value))} /></Field>
      </fieldset>

      <Field label="note"><textarea rows={3} value={v.notes ?? ''} onChange={(e) => set('notes', e.target.value)} /></Field>
      {!project && price > 0 && (
        <label className="check"><input type="checkbox" checked={makeInstallments} onChange={(e) => setMakeInstallments(e.target.checked)} />
          <span>Creează tranșele de plată ({parts.map((x) => `${x.pct}%`).join(' / ')}) ca „de încasat”</span></label>
      )}
    </Drawer>
  );
}
