'use client';

import { useEffect, useState } from 'react';
import Icon, { type IconName } from './Icons';

export const money = (n: number, c = 'RON') => `${Math.round(n).toLocaleString('ro-RO')} ${c}`;
export const dateRo = (d: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  d ? new Date(d.length === 10 ? d + 'T00:00:00' : d).toLocaleDateString('ro-RO', opts) : '—';
export const initials = (s: string) => s.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

/** Deterministic hue for an avatar from a name. */
export function hueOf(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}
export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const h = hueOf(name);
  return (
    <span className="avatar" style={{ width: size, height: size, ['--h' as string]: h }} aria-hidden>
      {initials(name)}
    </span>
  );
}

export function Panel({ title, action, onAction, className = '', children, delay = 0 }: {
  title?: React.ReactNode; action?: string; onAction?: () => void; className?: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <section className={`panel ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {(title || action) && (
        <header className="panel-h">
          {title && <h2>{title}</h2>}
          {action && <button className="link-btn" onClick={onAction}>{action}<Icon name="chevron" size={14} /></button>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Pills<T extends string>({ items, value, onChange, label }: {
  items: readonly { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="pills" role="tablist" aria-label={label}>
      {items.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className={value === t.id ? 'on' : ''} onClick={() => onChange(t.id)}>
          {t.label}{t.count !== undefined && <em>{t.count}</em>}
        </button>
      ))}
    </div>
  );
}

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="page-h">
      <div>
        <h1>{title}</h1>
        {sub && <p className="dim">{sub}</p>}
      </div>
      {children && <div className="page-h-r">{children}</div>}
    </div>
  );
}

export function Empty({ icon, text, children }: { icon: IconName; text: string; children?: React.ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-i"><Icon name={icon} size={26} /></span>
      <p>{text}</p>
      {children}
    </div>
  );
}

export function Search({ value, onChange, placeholder = 'caută…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="search-in">
      <Icon name="search" size={16} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  );
}

/** Slide-in form drawer with Esc to close, delete confirmation and save. */
export function Drawer({ title, onClose, onSubmit, onDelete, busy, error, children, wide }: {
  title: string; onClose: () => void; onSubmit: () => Promise<void>; onDelete?: () => Promise<void>;
  busy?: boolean; error?: string; children: React.ReactNode; wide?: boolean;
}) {
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr('');
    try { await onSubmit(); } catch (x) { setErr(x instanceof Error ? x.message : 'Nu s-a putut salva'); setSaving(false); }
  }
  return (
    <div className="drawer-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className={`drawer${wide ? ' wide' : ''}`} onSubmit={submit} aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button type="button" className="ghost" onClick={onClose} aria-label="Închide">esc</button>
        </header>
        {children}
        {(error || err) && <p className="err">{error || err}</p>}
        <footer>
          {onDelete && (confirm
            ? <button type="button" className="danger" onClick={onDelete}>sigur? șterge</button>
            : <button type="button" className="ghost" onClick={() => setConfirm(true)}>șterge</button>)}
          <span className="grow" />
          <button type="button" className="ghost" onClick={onClose}>anulează</button>
          <button type="submit" className="primary" disabled={busy || saving}>{saving ? 'se salvează…' : 'salvează'}</button>
        </footer>
      </form>
    </div>
  );
}

type Opt = { id: string; label: string };
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="f"><span>{label}</span>{children}</label>;
}
export function Select({ value, onChange, options, empty }: { value: string; onChange: (v: string) => void; options: readonly Opt[]; empty?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {empty !== undefined && <option value="">{empty}</option>}
      {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  );
}
