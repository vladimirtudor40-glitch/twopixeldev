'use client';

import { useState } from 'react';
import { OWNERS, emptyClient, ownerLabel, projectStatusLabel, type Client, type ClientInput } from '@/lib/types';
import Icon from './Icons';
import { Avatar, Drawer, Empty, Field, PageHead, Search, Select, money } from './ui';
import { paidOf, type Crm, type Data } from './store';

const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, '').replace(/^0/, '+40')}`;

export default function Clients({ data, crm, onOpenProject }: { data: Data; crm: Crm; onOpenProject: (clientId: string) => void }) {
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Client | 'new' | null>(null);
  const term = q.trim().toLowerCase();
  const shown = data.clients.filter((c) => !term || [c.name, c.company, c.city, c.email, c.phone].some((v) => v?.toLowerCase().includes(term)));

  return (
    <div className="view">
      <PageHead title="Clienți" sub={`${data.clients.length} clienți, fiecare cu proiectele și plățile lui.`}>
        <Search value={q} onChange={setQ} placeholder="caută client…" />
        <button className="primary" onClick={() => setEditing('new')}><Icon name="plus" size={16} />client nou</button>
      </PageHead>

      {shown.length === 0 ? (
        <Empty icon="users" text={data.clients.length ? 'Niciun client găsit.' : 'Niciun client încă.'}>
          <button className="primary" onClick={() => setEditing('new')}><Icon name="plus" size={16} />adaugă primul client</button>
        </Empty>
      ) : (
        <ul className="cards">
          {shown.map((c, i) => {
            const projects = data.projects.filter((p) => p.client_id === c.id);
            const billed = projects.filter((p) => p.status !== 'anulat' && p.status !== 'oferta').reduce((s, p) => s + p.price, 0);
            const paid = data.payments.filter((p) => p.client_id === c.id && p.paid).reduce((s, p) => s + p.amount, 0);
            const due = projects.filter((p) => p.status !== 'anulat').reduce((s, p) => s + Math.max(0, p.price - paidOf(data.payments, p.id)), 0);
            return (
              <li key={c.id} style={{ animationDelay: `${i * 40}ms` }}>
                <div className="card">
                  <button className="card-title as-btn" onClick={() => setEditing(c)}>
                    <Avatar name={c.name} size={44} />
                    <div><h3>{c.name}</h3><p className="dim small">{[c.company, c.city].filter(Boolean).join(' · ') || ownerLabel(c.owner)}</p></div>
                  </button>
                  <dl>
                    <div><dt>vândut</dt><dd>{money(billed)}</dd></div>
                    <div><dt>încasat</dt><dd className="cy">{money(paid)}</dd></div>
                    <div><dt>rest</dt><dd className={due ? 'warn' : ''}>{money(due)}</dd></div>
                  </dl>
                  {projects.length > 0 && (
                    <div className="tags">{projects.slice(0, 4).map((p) => <span key={p.id} className={`tag ps-${p.status}`}>{p.name} · {projectStatusLabel(p.status)}</span>)}</div>
                  )}
                  <div className="card-foot small">
                    {c.phone ? <a href={telHref(c.phone)}><Icon name="phone" size={14} />{c.phone}</a> : <span className="dim">fără telefon</span>}
                    {c.email && <a href={`mailto:${c.email}`}><Icon name="mail" size={14} />email</a>}
                    <button className="link-btn inline" onClick={() => onOpenProject(c.id)}>+ proiect</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && <ClientForm client={editing === 'new' ? null : editing} crm={crm} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ClientForm({ client, crm, onClose }: { client: Client | null; crm: Crm; onClose: () => void }) {
  const [v, setV] = useState<ClientInput>(() => {
    if (!client) return emptyClient();
    const { id: _i, created_at: _c, updated_at: _u, updated_by: _b, ...rest } = client;
    return { ...emptyClient(), ...rest };
  });
  const t = (k: keyof ClientInput, label: string, type = 'text', extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Field label={label}><input type={type} value={(v[k] as string | null) ?? ''} onChange={(e) => setV((p) => ({ ...p, [k]: e.target.value }))} {...extra} /></Field>
  );
  return (
    <Drawer title={client ? client.name : 'client nou'} onClose={onClose}
      onSubmit={async () => { await crm.save('clients', v, client?.id); onClose(); }}
      onDelete={client ? async () => { await crm.remove('clients', client.id); onClose(); } : undefined}>
      <fieldset><legend>contact</legend>
        {t('name', 'nume persoană / firmă', 'text', { required: true, autoFocus: !client })}
        <div className="row">{t('company', 'firmă')}{t('cui', 'CUI / CIF')}</div>
        <div className="row">{t('phone', 'telefon', 'tel')}{t('email', 'email', 'email')}</div>
        <div className="row">{t('city', 'oraș')}
          <Field label="cine se ocupă"><Select value={v.owner} onChange={(x) => setV((p) => ({ ...p, owner: x as ClientInput['owner'] }))} options={OWNERS} /></Field>
        </div>
      </fieldset>
      <Field label="note"><textarea rows={4} value={v.notes ?? ''} onChange={(e) => setV((p) => ({ ...p, notes: e.target.value }))} /></Field>
    </Drawer>
  );
}
