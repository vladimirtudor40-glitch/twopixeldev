// Import leads from a google-maps-scraper CSV (github.com/gosom/google-maps-scraper).
// Keeps only businesses without a real website and drops the ones already in the table.
import type { Site } from './types';

/** RFC 4180 CSV: quoted fields, "" escapes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const s = text.replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((v) => v !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((v) => v !== '')) rows.push(row);
  return rows;
}

export type Lead = {
  name: string;
  phone: string;
  email: string;
  maps_url: string;
  website: string; // '' or a social-only page (Facebook, Instagram…)
  category: string;
  address: string;
  rating: string;
  reviews: string;
};

const SOCIAL = /(^|\.)(facebook|fb|instagram|tiktok|linktr|linkedin|wa)\.(com|me|ee)|(^|\.)(m\.me|business\.site)/i;
const host = (u: string) => { try { return new URL(/^https?:\/\//i.test(u) ? u : `https://${u}`).hostname; } catch { return u; } };
/** True when the business has its own website (a Facebook/Instagram page does not count). */
export const hasOwnSite = (website: string) => !!website.trim() && !SOCIAL.test(host(website.trim()));

/** Last 9 digits of a phone number, so +40 721…, 0721… and 0721 … match. */
export const phoneKey = (p: string | null | undefined) => (p || '').replace(/\D/g, '').slice(-9);
const nameKey = (n: string | null | undefined) =>
  (n || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const mapsKey = (u: string | null | undefined) => {
  const v = (u || '').trim();
  const cid = v.match(/[?&]cid=(\d+)/) || v.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  return cid ? cid[1] : v.split('?')[0];
};

export type ImportPlan = {
  total: number;        // businesses in the file
  withSite: number;     // skipped: have their own website
  closed: number;       // skipped: permanently closed
  duplicates: number;   // skipped: already in the table (or twice in the file)
  leads: Lead[];        // to import
};

export function planImport(csv: string, existing: Site[]): ImportPlan {
  const [head, ...body] = parseCsv(csv);
  if (!head) throw new Error('Fișierul e gol.');
  const col = (...names: string[]) => head.findIndex((h) => names.includes(h.trim().toLowerCase()));
  const idx = {
    name: col('title', 'name'), phone: col('phone'), email: col('emails', 'email'), link: col('link', 'url'),
    website: col('website'), category: col('category'), address: col('address', 'complete_address'),
    rating: col('review_rating', 'rating'), reviews: col('review_count', 'reviews'), status: col('status'),
  };
  if (idx.name < 0) throw new Error('Nu găsesc coloana „title”. E un CSV scos de google-maps-scraper?');
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] || '').trim() : '');

  const phones = new Set(existing.map((s) => phoneKey(s.client_phone)).filter((k) => k.length >= 9));
  const maps = new Set(existing.map((s) => mapsKey(s.maps_url)).filter(Boolean));
  const names = new Set(existing.map((s) => nameKey(s.name)).filter(Boolean));

  const plan: ImportPlan = { total: 0, withSite: 0, closed: 0, duplicates: 0, leads: [] };
  for (const r of body) {
    const name = get(r, idx.name);
    if (!name) continue;
    plan.total++;
    const website = get(r, idx.website);
    if (hasOwnSite(website)) { plan.withSite++; continue; }
    if (/permanent/i.test(get(r, idx.status))) { plan.closed++; continue; }
    const phone = get(r, idx.phone);
    const link = get(r, idx.link);
    const pk = phoneKey(phone), mk = mapsKey(link), nk = nameKey(name);
    if ((pk.length >= 9 && phones.has(pk)) || (mk && maps.has(mk)) || names.has(nk)) { plan.duplicates++; continue; }
    if (pk.length >= 9) phones.add(pk);
    if (mk) maps.add(mk);
    names.add(nk);
    plan.leads.push({
      name, phone, website, maps_url: link,
      email: get(r, idx.email).replace(/^\[|\]$/g, '').split(/[,;\s]+/).map((e) => e.replace(/"/g, '')).find((e) => e.includes('@')) || '',
      category: get(r, idx.category), address: get(r, idx.address),
      rating: get(r, idx.rating), reviews: get(r, idx.reviews),
    });
  }
  return plan;
}

/** Text for the Observații column. */
export function leadNotes(l: Lead) {
  const rating = l.rating && Number(l.rating) ? `${l.rating}★${l.reviews ? ` (${l.reviews})` : ''}` : '';
  return [l.category, l.address, rating, l.website ? `doar ${host(l.website).replace(/^www\./, '')}` : 'fără site']
    .filter(Boolean).join(' · ');
}
