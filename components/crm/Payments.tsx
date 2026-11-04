'use client';

import { useMemo, useState } from 'react';
import { PAYMENT_KINDS, daysLeft, emptyPayment, paymentKindLabel, type Payment, type PaymentInput, type PaymentKind } from '@/lib/types';
import { CountUp } from './Charts';
import Icon from './Icons';
import { Avatar, Drawer, Empty, Field, PageHead, Pills, Search, Select, dateRo, money } from './ui';
import type { Crm, Data } from './store';

type Filter = 'toate' | 'incasate' | 'asteptare';

export default function Payments({ data, onOpen }: { data: Data; onOpen: (p: Payment | 'new') => void }) {
  const [filter, setFilter] = useState<Filter>('toate');
  const [q, setQ] = useState('');
  const client = useMemo(() => new Map(data.clients.map((c) => [c.id, c.name])), [data.clients]);
  const project = useMemo(() => new Map(data.projects.map((p) => [p.id, p.name])), [data.projects]);

  const list = [...data.payments]
    .filter((p) => filter === 'toate' || (filter === 'incasate' ? p.paid : !p.paid))
    .filter((p) => !q.trim() || [p.label, p.invoice, client.get(p.client_id ?? ''), project.get(p.project_id ?? '')].some((v) => v?.toLowerCase().includes(q.trim().toLowerCase())))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const year = String(new Date().getFullYear());
  const inYear = data.payments.filter((p) => p.paid && p.date?.startsWith(year)).reduce((s, p) => s + p.amount, 0);
  const waiting = data.payments.filter((p) => !p.paid).reduce((s, p) => s + p.amount, 0);
  const late = data.payments.filter((p) => !p.paid && p.date && (daysLeft(p.date) ?? 0) < 0);

  return (
    <div className="view">
      <PageHead title="Plăți" sub="Încasări și tranșe programate. Totalurile sunt fără TVA.">
        <Search value={q} onChange={setQ} placeholder="caută plată…" />
        <button className="primary" onClick={() => onOpen('new')}><Icon name="plus" size={16} />plată nouă</button>
      </PageHead>
      <div className="kpis">
        <div className="kpi c1"><b><CountUp value={inYear} format={(n) => money(n)} /></b><span>încasat în {year}</span></div>
        <div className="kpi c3"><b><CountUp value={waiting} format={(n) => money(n)} /></b><span>programat, neîncasat</span></div>
        <div className={`kpi ${late.length ? 'c2' : ''}`}><b><CountUp value={late.reduce((s, p) => s + p.amount, 0)} format={(n) => money(n)} /></b><span>{late.length} restante</span></div>
      </div>
      <Pills label="Filtru plăți" value={filter} onChange={setFilter} items={[
        { id: 'toate', label: 'Toate' }, { id: 'incasate', label: 'Încasate' }, { id: 'asteptare', label: 'De încasat' },
      ]} />

      {list.length === 0 ? <Empty icon="wallet" text="Nicio plată aici." /> : (
        <div className="panel table-wrap">
          <table className="table">
            <thead><tr><th>client / proiect</th><th>tip</th><th>data</th><th>factură</th><th className="r">sumă</th></tr></thead>
            <tbody>
              {list.map((p, i) => {
                const who = client.get(p.client_id ?? '') || project.get(p.project_id ?? '') || p.label || '—';
                const d = daysLeft(p.date);
                return (
                  <tr key={p.id} onClick={() => onOpen(p)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(p)} style={{ animationDelay: `${i * 25}ms` }}>
                    <td><span className="cell-who"><Avatar name={who} size={32} /><span><b>{who}</b><span className="dim small">{[project.get(p.project_id ?? ''), p.label].filter(Boolean).join(' · ')}</span></span></span></td>
                    <td><span className={`tag k-${p.kind}`}>{paymentKindLabel(p.kind)}</span></td>
                    <td className={!p.paid && d !== null && d < 0 ? 'warn' : ''}>{dateRo(p.date)}{!p.paid && <span className="dim small"> · {d !== null && d < 0 ? 'restant' : 'scadent'}</span>}</td>
                    <td className="dim">{p.invoice || '—'}</td>
                    <td className={`r ${p.paid ? 'cy' : 'dim'}`}><b>{p.paid ? '+' : ''}{money(p.amount, p.currency)}</b></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PaymentForm({ payment, data, crm, onClose }: { payment: Payment | null; data: Data; crm: Crm; onClose: () => void }) {
  const [v, setV] = useState<PaymentInput>(() => {
    if (!payment) return emptyPayment();
    const { id: _i, created_at: _c, updated_at: _u, updated_by: _b, ...rest } = payment;
    return { ...emptyPayment(), ...rest };
  });
  const set = <K extends keyof PaymentInput>(k: K, val: PaymentInput[K]) => setV((p) => ({ ...p, [k]: val }));
  function pickProject(id: string) {
    const p = data.projects.find((x) => x.id === id);
    setV((s) => ({ ...s, project_id: id || null, client_id: p?.client_id ?? s.client_id, currency: p?.currency ?? s.currency }));
  }
  return (
    <Drawer title={payment ? 'plată' : 'plată nouă'} onClose={onClose}
      onSubmit={async () => { await crm.save('payments', v, payment?.id); onClose(); }}
      onDelete={payment ? async () => { await crm.remove('payments', payment.id); onClose(); } : undefined}>
      <fieldset><legend>pentru</legend>
        <Field label="proiect"><Select value={v.project_id ?? ''} onChange={pickProject} empty="—" options={data.projects.map((p) => ({ id: p.id, label: p.name }))} /></Field>
        <Field label="client"><Select value={v.client_id ?? ''} onChange={(x) => set('client_id', x || null)} empty="—" options={data.clients.map((c) => ({ id: c.id, label: c.name }))} /></Field>
      </fieldset>
      <fieldset><legend>sumă</legend>
        <div className="row three">
          <Field label="sumă"><input type="number" min={0} step="0.01" required value={v.amount || ''} onChange={(e) => set('amount', Number(e.target.value))} autoFocus={!payment} /></Field>
          <Field label="tip"><Select value={v.kind} onChange={(x) => set('kind', x as PaymentKind)} options={PAYMENT_KINDS} /></Field>
          <Field label="monedă"><Select value={v.currency} onChange={(x) => set('currency', x)} options={[{ id: 'RON', label: 'RON' }, { id: 'EUR', label: 'EUR' }]} /></Field>
        </div>
        <Field label="descriere"><input value={v.label} onChange={(e) => set('label', e.target.value)} placeholder="ex. Avans 50%" /></Field>
        <div className="row">
          <Field label={v.paid ? 'încasat la' : 'scadent la'}><input type="date" value={v.date ?? ''} onChange={(e) => set('date', e.target.value || null)} /></Field>
          <Field label="nr. factură"><input value={v.invoice ?? ''} onChange={(e) => set('invoice', e.target.value)} /></Field>
        </div>
        <label className="check"><input type="checkbox" checked={v.paid} onChange={(e) => set('paid', e.target.checked)} /><span>Încasată</span></label>
      </fieldset>
      <Field label="note"><textarea rows={3} value={v.notes ?? ''} onChange={(e) => set('notes', e.target.value)} /></Field>
    </Drawer>
  );
}
