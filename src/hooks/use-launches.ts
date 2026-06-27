import { useQuery } from '@tanstack/react-query';

import { fetchLaunches } from '@/lib/coins';
import { hasSupabase } from '@/lib/supabase';

/** The signed-in user's launched coins (from Supabase), newest first. */
export function useLaunches(userId?: string) {
  return useQuery({
    queryKey: ['launches', userId],
    enabled: !!userId && hasSupabase,
    queryFn: () => fetchLaunches(userId!),
  });
}
