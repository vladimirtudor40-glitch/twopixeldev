'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/backend';

/** Login form. The password is checked by the Worker (worker/index.ts). */
export default function LoginPanel({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'busy' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const first = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('busy');
    setMessage('');
    const error = await signIn(email.trim(), password);
    if (error) {
      setStatus('error');
      setMessage(error === 'too_many_attempts' ? 'LOCKED // prea multe încercări, revino în 15 minute' : 'ACCESS DENIED // email sau parolă greșită');
      return;
    }
    setMessage('ACCESS GRANTED');
    router.push('/app/');
  }

  return (
    <div className="login-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="login" onSubmit={submit} aria-labelledby="login-title">
        <span className="tick tl" /><span className="tick tr" /><span className="tick bl" /><span className="tick br" />
        <p className="login-kicker">twopixeldev // internal</p>
        <h2 id="login-title">Login</h2>

        <label>
          <span>email</span>
          <input ref={first} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>parolă</span>
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <p className="login-msg" role="status" aria-live="polite">{message}</p>

        <button type="submit" className="login-btn" disabled={status === 'busy'}>
          {status === 'busy' ? 'se verifică…' : 'intră'}
        </button>
        <button type="button" className="login-back" onClick={onClose}>esc // înapoi</button>
      </form>
    </div>
  );
}
