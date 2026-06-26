import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { hasSupabase, supabase } from '@/lib/supabase';

/**
 * Watchlist (starred tokens), persisted in Supabase keyed by the Privy user id.
 * Run supabase/schema.sql once to create the table. No-ops gracefully if
 * Supabase isn't configured or the user isn't known yet.
 */
export function useWatchlist(userId?: string) {
  const qc = useQueryClient();
  const enabled = !!userId && hasSupabase;

  const { data: ids } = useQuery({
    queryKey: ['watchlist', userId],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('token_id')
        .eq('user_id', userId!);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.token_id as string));
    },
  });

  const toggle = useMutation({
    mutationFn: async (t: { id: string; name: string; symbol: string; starred: boolean }) => {
      if (!userId) return;
      if (t.starred) {
        await supabase.from('watchlist').delete().eq('user_id', userId).eq('token_id', t.id);
      } else {
        await supabase.from('watchlist').insert({
          user_id: userId,
          token_id: t.id,
          token_name: t.name,
          token_symbol: t.symbol,
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist', userId] }),
  });

  return {
    isStarred: (id: string) => ids?.has(id) ?? false,
    toggle: toggle.mutate,
  };
}
