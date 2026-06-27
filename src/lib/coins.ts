import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system/legacy';

import { hasSupabase, supabase } from '@/lib/supabase';

export type LaunchedCoin = {
  id: string;
  name: string;
  ticker: string;
  image_url: string | null;
  socials: string | null;
  created_at: string;
};

/** A user's launched coins, newest first. */
export async function fetchLaunches(userId: string): Promise<LaunchedCoin[]> {
  if (!hasSupabase) return [];
  const { data, error } = await supabase
    .from('coins')
    .select('id, name, ticker, image_url, socials, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as LaunchedCoin[];
}

export type LaunchCoinInput = {
  userId?: string;
  name: string;
  ticker: string;
  socials?: string;
  imageUri?: string | null;
};

/**
 * Launches a coin: uploads the picked image to Supabase Storage (bucket `coins`)
 * and saves the coin record to the `coins` table. Returns the public image URL.
 * (A real on-chain SPL mint via pump.fun needs the Privy wallet — trading phase.)
 */
export async function launchCoin(input: LaunchCoinInput): Promise<{ imageUrl: string | null }> {
  if (!hasSupabase) throw new Error('Supabase not configured');

  let imageUrl: string | null = null;

  if (input.imageUri) {
    const base64 = await FileSystem.readAsStringAsync(input.imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const bytes = Buffer.from(base64, 'base64');
    const path = `${input.userId ?? 'anon'}/${Date.now()}.jpg`;

    const { error: upErr } = await supabase.storage
      .from('coins')
      .upload(path, bytes, { contentType: 'image/jpeg', upsert: true });
    if (upErr) throw upErr;

    imageUrl = supabase.storage.from('coins').getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase.from('coins').insert({
    user_id: input.userId ?? null,
    name: input.name,
    ticker: input.ticker.toUpperCase(),
    image_url: imageUrl,
    socials: input.socials || null,
  });
  if (error) throw error;

  return { imageUrl };
}
