import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { hasSupabase, supabase } from '@/lib/supabase';

/**
 * Recent search queries, persisted in Supabase per Privy user. Shown as chips in
 * the search screen. Run supabase/schema.sql once to create the table.
 */
export function useRecentSearches(userId?: string) {
  const qc = useQueryClient();
  const enabled = !!userId && hasSupabase;
  const key = ['recent-searches', userId];

  const { data: recents } = useQuery({
    queryKey: key,
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recent_searches')
        .select('query')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
        .limit(12);
      if (error) throw error;
      const seen = new Set<string>();
      const out: string[] = [];
      for (const r of data ?? []) {
        const q = r.query as string;
        if (!seen.has(q)) {
          seen.add(q);
          out.push(q);
        }
      }
      return out.slice(0, 6);
    },
  });

  const add = useMutation({
    mutationFn: async (query: string) => {
      const q = query.trim();
      if (!userId || !q) return;
      await supabase.from('recent_searches').insert({ user_id: userId, query: q });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const clear = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      await supabase.from('recent_searches').delete().eq('user_id', userId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { recents: recents ?? [], add: add.mutate, clear: clear.mutate };
}
