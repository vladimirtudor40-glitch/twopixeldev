import type { IconName } from './Icons';

export const SECTIONS = [
  { id: 'overview', label: 'Dashboard', icon: 'home' },
  { id: 'projects', label: 'Proiecte', icon: 'folder' },
  { id: 'clients', label: 'Clienți', icon: 'users' },
  { id: 'payments', label: 'Plăți', icon: 'wallet' },
  { id: 'sites', label: 'Site-uri', icon: 'globe' },
  { id: 'domains', label: 'Domenii', icon: 'domain' },
  { id: 'todos', label: 'To-do', icon: 'check' },
  { id: 'leads', label: 'Leaduri', icon: 'target' },
  { id: 'prices', label: 'Prețuri', icon: 'tag' },
] as const satisfies readonly { id: string; label: string; icon: IconName }[];

export type Section = (typeof SECTIONS)[number]['id'];

/** Sections shown in the app for now. The others stay in the code, hidden; add their ids back here to show them. */
export const VISIBLE: readonly Section[] = ['sites'];
export const NAV = SECTIONS.filter((s) => VISIBLE.includes(s.id));
