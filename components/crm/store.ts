'use client';

import { useCallback, useEffect, useState } from 'react';
import { deleteItem, listCol, listSites, saveItem, type Col } from '@/lib/backend';
import type { Client, Lead, Payment, Project, Site, Todo } from '@/lib/types';

export type Data = {
  sites: Site[];
  clients: Client[];
  projects: Project[];
  payments: Payment[];
  todos: Todo[];
  leads: Lead[];
};

const num = (v: unknown) => Number(v) || 0;

/** Loads every KV collection once and keeps them in memory; writes go through the Worker API and reload. */
export function useCrm(onUnauthorized: () => void) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');

  const fail = useCallback((e: unknown) => {
    if (e instanceof Error && e.message === 'unauthorized') onUnauthorized();
    else setError(e instanceof Error ? e.message : 'Eroare la încărcare');
  }, [onUnauthorized]);

  const load = useCallback(async () => {
    try {
      const [sites, clients, projects, payments, todos, leads] = await Promise.all([
        listSites(), listCol<Client>('clients'), listCol<Project>('projects'), listCol<Payment>('payments'),
        listCol<Todo>('todos'), listCol<Lead>('leads'),
      ]);
      setData({
        sites,
        clients,
        projects: projects.map((p) => ({ ...p, price: num(p.price), base_price: num(p.base_price), plan_monthly: num(p.plan_monthly), discount: num(p.discount), progress: num(p.progress), extras: Array.isArray(p.extras) ? p.extras : [] })),
        payments: payments.map((p) => ({ ...p, amount: num(p.amount) })),
        todos,
        leads,
      });
      setError('');
    } catch (e) { fail(e); }
  }, [fail]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async <T,>(col: Col, input: object, id?: string) => {
    const saved = await saveItem<T>(col, input, id);
    await load();
    return saved;
  }, [load]);

  const remove = useCallback(async (col: Col, id: string) => {
    await deleteItem(col, id);
    await load();
  }, [load]);

  return { data, error, load, save, remove };
}
export type Crm = ReturnType<typeof useCrm>;

// ---------- derived numbers ----------
export const monthKey = (d: string) => d.slice(0, 7);
const RO_MONTHS = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'nov', 'dec'];
export const monthLabel = (key: string) => RO_MONTHS[Number(key.slice(5, 7)) - 1] ?? key;

export function lastMonths(n: number, now = new Date()) {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

export const paidOf = (payments: Payment[], projectId: string) =>
  payments.filter((p) => p.project_id === projectId && p.paid && p.kind !== 'mentenanta' && p.kind !== 'domeniu').reduce((s, p) => s + p.amount, 0);

export const ACTIVE_PROJECT = ['in_lucru', 'review'] as const;
