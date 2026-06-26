import { createClient } from '@supabase/supabase-js';

/**
 * SUPABASE client — our backend DB (watchlist, recent searches).
 * Auth is handled by Privy, NOT Supabase, so we disable Supabase's own session
 * handling and just use the Postgres/REST layer with the public anon key.
 */

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** True when Supabase is configured — hooks no-op gracefully if not. */
export const hasSupabase = URL.length > 0 && ANON.length > 0;

export const supabase = createClient(URL, ANON, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
