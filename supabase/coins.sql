-- ChadWallet — launched coins (image in Storage, metadata in a table).
-- Run once in the Supabase SQL editor (or applied via the pooler).

-- table for launched coins
create table if not exists public.coins (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  name text not null,
  ticker text not null,
  image_url text,
  socials text,
  created_at timestamptz default now()
);
alter table public.coins enable row level security;
drop policy if exists "anon all coins" on public.coins;
create policy "anon all coins" on public.coins for all to anon using (true) with check (true);

-- public storage bucket for coin images
insert into storage.buckets (id, name, public)
values ('coins', 'coins', true)
on conflict (id) do nothing;

-- demo storage policies: anon can upload + read coin images
drop policy if exists "anon upload coins" on storage.objects;
drop policy if exists "anon read coins" on storage.objects;
create policy "anon upload coins" on storage.objects
  for insert to anon with check (bucket_id = 'coins');
create policy "anon read coins" on storage.objects
  for select to anon using (bucket_id = 'coins');
