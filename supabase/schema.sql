-- ChadWallet — Supabase schema.
-- Run this ONCE in the Supabase dashboard → SQL editor.
-- Auth is handled by Privy (not Supabase), so rows are keyed by the Privy user id.

-- Starred tokens (token-detail star button).
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  token_id text not null,
  token_name text,
  token_symbol text,
  created_at timestamptz default now(),
  unique (user_id, token_id)
);

-- Recent search queries (shown as chips in the search screen).
create table if not exists public.recent_searches (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  query text not null,
  created_at timestamptz default now()
);

-- DEMO access: allow the public anon key full access (takehome only).
-- For production, scope these policies to an authenticated user instead.
alter table public.watchlist enable row level security;
alter table public.recent_searches enable row level security;
create policy "anon all watchlist" on public.watchlist for all to anon using (true) with check (true);
create policy "anon all recent" on public.recent_searches for all to anon using (true) with check (true);
