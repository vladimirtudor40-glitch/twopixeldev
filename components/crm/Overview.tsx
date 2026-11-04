'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES } from '@/lib/pricing';
import { daysLeft, projectStatusLabel, type Payment } from '@/lib/types';
import { BarChart, CountUp, Donut, Ring, Sparkline } from './Charts';
import Icon from './Icons';
import { Avatar, Panel, Pills, dateRo, money } from './ui';
import { ACTIVE_PROJECT, lastMonths, monthKey, monthLabel, paidOf, type Crm, type Data } from './store';
import type { Section } from './nav';

type Period = '6' | '12' | 'an';
const PERIODS = [{ id: '6', label: '6 luni' }, { id: '12', label: '12 luni' }, { id: 'an', label: 'Anul acesta' }] as const;

export default function Overview({ data, crm, go, user, onNewProject, onOpenPayment }: {
  data: Data; crm: Crm; go: (s: Section) => void; user: string;
  onNewProject: () => void; onOpenPayment: (p: Payment | 'new') => void;
}) {
  const [period, setPeriod] = useState<Period>('6');
  const now = new Date();
  const thisMonth = monthKey(now.toISOString());
  const prevMonth = lastMonths(2, now)[0];

  const months = useMemo(() => {
    if (period === 'an') return lastMonths(now.getMonth() + 1, now);
    return lastMonths(Number(period), now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const projectById = useMemo(() => new Map(data.projects.map((p) => [p.id, p])), [data.projects]);
  const clientById = useMemo(() => new Map(data.clients.map((c) => [c.id, c])), [data.clients]);
  const paid = data.payments.filter((p) => p.paid && p.date);

  const byMonth = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of paid) m.set(monthKey(p.date!), (m.get(monthKey(p.date!)) ?? 0) + p.amount);
    return m;
  }, [paid]);

  const bars = months.map((k) => ({ label: monthLabel(k), value: byMonth.get(k) ?? 0, sub: k.slice(0, 4) }));
  const inPeriod = paid.filter((p) => months.includes(monthKey(p.date!)));
  const periodTotal = inPeriod.reduce((s, p) => s + p.amount, 0);
  const cur = byMonth.get(thisMonth) ?? 0;
  const prev = byMonth.get(prevMonth) ?? 0;
  const delta = prev ? Math.round(((cur - prev) / prev) * 100) : cur ? 100 : 0;

  const slices = useMemo(() => {
    const sums = new Map<string, number>();
    for (const p of inPeriod) {
      const key = p.kind === 'mentenanta' ? 'mentenanta' : projectById.get(p.project_id ?? '')?.category ?? 'altul';
      sums.set(key, (sums.get(key) ?? 0) + p.amount);
    }
    return [
      ...CATEGORIES.map((c) => ({ label: c.label, value: sums.get(c.id) ?? 0, color: c.color })),
      { label: 'Mentenanță', value: sums.get('mentenanta') ?? 0, color: 'var(--c7)' },
    ];
  }, [inPeriod, projectById]);

  const live = data.projects.filter((p) => p.status !== 'anulat');
  const due = live.reduce((s, p) => s + Math.max(0, p.price - paidOf(data.payments, p.id)), 0);
  const overdue = data.payments.filter((p) => !p.paid && p.date && (daysLeft(p.date) ?? 0) < 0).length;
  const mrr = data.projects.filter((p) => ['livrat', 'mentenanta'].includes(p.status) && p.plan_id).reduce((s, p) => s + p.plan_monthly, 0);
  const active = data.projects.filter((p) => (ACTIVE_PROJECT as readonly string[]).includes(p.status));
  const pipeline = data.projects.filter((p) => p.status === 'oferta').reduce((s, p) => s + p.price, 0);

  const recent = data.payments.filter((p) => p.paid).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 5);
  const domains = data.sites
    .filter((s) => s.domain && s.domain_expires)
    .map((s) => ({ s, d: daysLeft(s.domain_expires)! }))
    .sort((a, b) => a.d - b.d);
  const soon = domains.filter((x) => x.d <= 60);

  const weeks = useMemo(() => {
    const out = Array(8).fill(0) as number[];
    const t = Date.now();
    for (const l of data.leads) {
      const w = Math.floor((t - new Date(l.created_at).getTime()) / (7 * 86_400_000));
      if (w >= 0 && w < 8) out[7 - w]++;
    }
    return out;
  }, [data.leads]);
  const openLeads = data.leads.filter((l) => !['castigat', 'pierdut'].includes(l.status)).length;
  const openTodos = data.todos.filter((t) => !t.done).sort((a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999'));

  const first = user.split('@')[0];
  const name = first === 'evelina' ? 'Evelina' : first.charAt(0).toUpperCase() + first.slice(1);
  const fmt = (n: number) => money(n);

  async function toggleTodo(id: string, done: boolean) {
    await crm.save('todos', { done }, id);
  }

  return (
    <div className="ov">
      <div className="ov-main">
        <div className="page-h">
          <div>
            <p className="kicker">salut, {name}</p>
            <h1>Dashboard</h1>
          </div>
        </div>
        <Pills items={PERIODS} value={period} onChange={setPeriod} label="Perioadă" />

        <Panel title="Flux venituri" action="Plăți" onAction={() => go('payments')} className="p-bars" delay={60}>
          <BarChart bars={bars} activeIndex={bars.length - 1} format={fmt} />
        </Panel>

        <div className="ov-row">
          <Panel title="Pe categorii" action="Proiecte" onAction={() => go('projects')} className="p-donut" delay={140}>
            <div className="donut-wrap">
              <Donut slices={slices} center={<CountUp value={periodTotal} format={(n) => money(n, '')} />} sub="RON încasați" />
              <ul className="legend">
                {slices.filter((s) => s.value > 0).length === 0 && <li className="dim small">Nicio plată în perioadă.</li>}
                {slices.filter((s) => s.value > 0).map((s) => (
                  <li key={s.label}><i style={{ background: s.color }} /><span>{s.label}</span><b>{money(s.value)}</b></li>
                ))}
              </ul>
            </div>
          </Panel>
          <div className="ov-stack">
            <Panel className="p-kpi" delay={200}>
              <div className="kpi-h"><h2>Încasat luna asta</h2><Icon name="trend" size={18} /></div>
              <p className="kpi-v"><CountUp value={cur} format={fmt} /></p>
              <div className="kpi-f">
                <span className="dim small">față de {monthLabel(prevMonth)}: {money(prev)}</span>
                <span className={`chip ${delta >= 0 ? 'up' : 'down'}`}>{delta >= 0 ? '+' : ''}{delta}%</span>
              </div>
            </Panel>
            <Panel className="p-kpi" delay={260}>
              <div className="kpi-h"><h2>De încasat</h2><button className="icon-btn" onClick={() => onOpenPayment('new')} aria-label="Plată nouă"><Icon name="plus" size={16} /></button></div>
              <p className="kpi-v"><CountUp value={due} format={fmt} /></p>
              <div className="kpi-f">
                <span className="dim small">ofertat în așteptare: {money(pipeline)}</span>
                <span className={`chip ${overdue ? 'down' : 'violet'}`}>{overdue ? `${overdue} restante` : `${live.length} proiecte`}</span>
              </div>
            </Panel>
          </div>
        </div>

        <div className="ov-row">
          <Panel title="Proiecte în lucru" action="Toate" onAction={() => go('projects')} delay={320}>
            {active.length === 0 ? <p className="dim small pad">Niciun proiect în lucru.</p> : (
              <ul className="plist">
                {active.slice(0, 5).map((p) => {
                  const d = daysLeft(p.deadline);
                  return (
                    <li key={p.id}>
                      <Avatar name={clientById.get(p.client_id ?? '')?.name || p.name} size={34} />
                      <div className="plist-m">
                        <b>{p.name}</b>
                        <span className="bar-mini"><i style={{ width: `${p.progress}%` }} /></span>
                      </div>
                      <span className={`small ${d !== null && d < 7 ? 'warn' : 'dim'}`}>{p.deadline ? (d! < 0 ? `întârziat ${-d!}z` : `${d} zile`) : projectStatusLabel(p.status)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
          <Panel title="De făcut" action="To-do" onAction={() => go('todos')} delay={380}>
            {openTodos.length === 0 ? <p className="dim small pad">Totul e bifat.</p> : (
              <ul className="tlist">
                {openTodos.slice(0, 5).map((t) => {
                  const d = t.due ? daysLeft(t.due) : null;
                  return (
                    <li key={t.id}>
                      <button className="tick-btn" onClick={() => toggleTodo(t.id, true)} aria-label={`Bifează ${t.title}`}><Icon name="check" size={14} /></button>
                      <span className="tlist-t">{t.title}</span>
                      {d !== null && <span className={`small ${d < 0 ? 'warn' : d <= 1 ? 'amber' : 'dim'}`}>{d < 0 ? 'întârziat' : d === 0 ? 'azi' : d === 1 ? 'mâine' : dateRo(t.due, { day: 'numeric', month: 'short' })}</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <aside className="ov-side panel" style={{ animationDelay: '100ms' }}>
        <header className="panel-h"><h2>Balanță</h2><button className="link-btn" onClick={() => go('payments')}>Detalii<Icon name="chevron" size={14} /></button></header>
        <div className="cardstack">
          <i className="cs-l l2" /><i className="cs-l l1" />
          <div className="hero">
            <span className="hero-k">Total încasat · {PERIODS.find((p) => p.id === period)!.label.toLowerCase()}</span>
            <b className="hero-v"><CountUp value={periodTotal} format={fmt} /></b>
            <button className="hero-add" onClick={onNewProject} aria-label="Proiect nou"><Icon name="plus" size={22} /></button>
            <span className="hero-f"><span>MRR mentenanță</span><b>{money(mrr)}/lună</b></span>
            <span className="hero-px" aria-hidden><i /><i /></span>
          </div>
          <div className="glass-sheet">
            <span>{active.length} proiecte active</span>
            <span>{data.clients.length} clienți · {data.sites.length} site-uri</span>
          </div>
        </div>

        <header className="panel-h"><h2>Plăți recente</h2><button className="link-btn" onClick={() => go('payments')}>Toate<Icon name="chevron" size={14} /></button></header>
        {recent.length === 0 ? (
          <p className="dim small">Nicio plată încă. <button className="link-btn inline" onClick={() => onOpenPayment('new')}>Adaugă prima</button></p>
        ) : (
          <ul className="tx">
            {recent.map((p) => {
              const who = clientById.get(p.client_id ?? '')?.name || projectById.get(p.project_id ?? '')?.name || p.label || 'Plată';
              return (
                <li key={p.id}>
                  <button onClick={() => onOpenPayment(p)}>
                    <Avatar name={who} size={36} />
                    <span className="tx-m"><b>{who}</b><span className="dim small">{p.label || p.kind} · {dateRo(p.date, { day: 'numeric', month: 'short' })}</span></span>
                    <span className={`tx-a ${p.paid ? 'in' : 'wait'}`}>{p.paid ? '+' : ''}{money(p.amount, p.currency)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="minis">
          <button className="mini" onClick={() => go('domains')}>
            <span className="mini-h">Domenii</span>
            {soon.length ? (
              <>
                <span className="mini-v warn">{soon.length}</span>
                <span className="dim small">expiră în 60 de zile</span>
              </>
            ) : domains[0] ? (
              <>
                <Ring value={1 - Math.min(domains[0].d, 365) / 365} color="var(--c1)"><b>{domains[0].d}</b></Ring>
                <span className="dim small">zile până la {domains[0].s.domain}</span>
              </>
            ) : <span className="dim small">fără date de expirare</span>}
          </button>
          <button className="mini" onClick={() => go('leads')}>
            <span className="mini-h">Leaduri</span>
            <span className="mini-v">{openLeads}</span>
            <Sparkline values={weeks} color="var(--c1)" />
          </button>
        </div>
      </aside>
    </div>
  );
}
