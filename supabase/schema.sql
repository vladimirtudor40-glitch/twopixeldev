-- twopixeldev: run once in Supabase → SQL Editor.

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text,
  client_phone text,
  client_email text,
  domain text,
  domain_expires date,
  hosting text,
  status text not null default 'in_lucru'
    check (status in ('oferta', 'in_lucru', 'live', 'mentenanta', 'pauza')),
  price numeric(10, 2) default 0,
  paid numeric(10, 2) default 0,
  currency text not null default 'RON',
  owner text not null default 'amandoi' check (owner in ('vladimir', 'eve', 'amandoi')),
  live_url text,
  repo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists sites_touch on public.sites;
create trigger sites_touch before update on public.sites
  for each row execute function public.touch_updated_at();

-- Only signed-in users (you and Eve) can read or change sites.
-- Turn OFF "Allow new users to sign up" in Authentication → Sign In / Providers,
-- so the only accounts are the two you create by hand.
alter table public.sites enable row level security;

drop policy if exists "team can do everything" on public.sites;
create policy "team can do everything" on public.sites
  for all to authenticated using (true) with check (true);
