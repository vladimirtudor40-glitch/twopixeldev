'use client';

import { useEffect, useState } from 'react';
import { OWNERS, STATUSES, emptySite, type Site, type SiteInput } from '@/lib/types';

type Props = {
  site: Site | null;
  onCancel: () => void;
  onSave: (input: SiteInput, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function SiteForm({ site, onCancel, onSave, onDelete }: Props) {
  const [v, setV] = useState<SiteInput>(() => {
    if (!site) return emptySite();
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = site;
    return rest;
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const set = <K extends keyof SiteInput>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await onSave(v, site?.id); }
    catch (x) { setErr(x instanceof Error ? x.message : 'Nu s-a putut salva'); setBusy(false); }
  }

  const text = (k: keyof SiteInput, label: string, type = 'text', extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="f">
      <span>{label}</span>
      <input type={type} value={(v[k] as string | number | null) ?? ''} onChange={set(k)} {...extra} />
    </label>
  );

  return (
    <div className="drawer-bg" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <form className="drawer" onSubmit={submit} aria-label={site ? `Editează ${site.name}` : 'Site nou'}>
        <header>
          <h2>{site ? site.name : 'site nou'}</h2>
          <button type="button" className="ghost" onClick={onCancel} aria-label="Închide">esc</button>
        </header>

        <fieldset><legend>proiect</legend>
          {text('name', 'nume site', 'text', { required: true, autoFocus: !site })}
          <div className="row">
            <label className="f"><span>status</span>
              <select value={v.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
            </label>
            <label className="f"><span>cine lucrează</span>
              <select value={v.owner} onChange={set('owner')}>{OWNERS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
            </label>
          </div>
        </fieldset>

        <fieldset><legend>client</legend>
          {text('client_name', 'nume')}
          <div className="row">{text('client_phone', 'telefon', 'tel')}{text('client_email', 'email', 'email')}</div>
        </fieldset>

        <fieldset><legend>domeniu & hosting</legend>
          <div className="row">{text('domain', 'domeniu', 'text', { placeholder: 'exemplu.ro' })}{text('domain_expires', 'expiră la', 'date')}</div>
          {text('hosting', 'hosting', 'text', { placeholder: 'Netlify, Hostinger…' })}
        </fieldset>

        <fieldset><legend>bani</legend>
          <div className="row three">
            {text('price', 'preț', 'number', { min: 0, step: '0.01' })}
            {text('paid', 'încasat', 'number', { min: 0, step: '0.01' })}
            {text('currency', 'monedă')}
          </div>
        </fieldset>

        <fieldset><legend>link-uri</legend>
          {text('live_url', 'site live', 'url', { placeholder: 'https://' })}
          {text('repo_url', 'repo / fișiere', 'text')}
        </fieldset>

        <label className="f"><span>note</span><textarea rows={4} value={v.notes ?? ''} onChange={set('notes')} /></label>

        {err && <p className="err">{err}</p>}

        <footer>
          {site && (confirmDel
            ? <button type="button" className="danger" onClick={() => onDelete(site.id)}>sigur? șterge</button>
            : <button type="button" className="ghost" onClick={() => setConfirmDel(true)}>șterge</button>)}
          <span className="grow" />
          <button type="button" className="ghost" onClick={onCancel}>anulează</button>
          <button type="submit" className="primary" disabled={busy}>{busy ? 'se salvează…' : 'salvează'}</button>
        </footer>
      </form>
    </div>
  );
}
