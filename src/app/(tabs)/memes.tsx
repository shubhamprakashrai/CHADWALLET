import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SegmentTabs } from '@/components/segment-tabs';
import { TokenRow } from '@/components/token-row';
import { useTrending } from '@/hooks/use-trending';
import type { Token } from '@/lib/mock';

const FILTERS = ['Trending', 'Gainers', 'Losers', 'Most Traded', 'Top MCap'] as const;

/** Sorts the trending list according to the selected filter chip. */
function applyFilter(tokens: Token[], filter: string): Token[] {
  const list = [...tokens];
  switch (filter) {
    case 'Gainers':
      return list.sort((a, b) => b.change - a.change);
    case 'Losers':
      return list.sort((a, b) => a.change - b.change);
    case 'Most Traded':
      return list.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
    case 'Top MCap':
      return list.sort((a, b) => b.mcap - a.mcap);
    default:
      return list; // Trending = Birdeye's rank order
  }
}

/**
 * MEMES ("/memes") — the Trending tokens list (a required screen), powered by
 * REAL Birdeye data via useTrending(). The filter chips re-sort the list;
 * pull-to-refresh calls refetch() for a genuine network refresh.
 */
export default function MemesScreen() {
  const [filter, setFilter] = useState<string>('Trending');
  const { data: tokens = [], isLoading, isError, isRefetching, refetch } = useTrending();

  const sorted = useMemo(() => applyFilter(tokens, filter), [tokens, filter]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <FlatList
        data={sorted}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TokenRow token={item} sparkline />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#22E06B" />
        }
        ListHeaderComponent={
          <View className="px-4 pb-2 pt-1">
            <Text className="mb-3 text-2xl font-bold text-text">Memes</Text>
            <SegmentTabs tabs={FILTERS} value={filter} onChange={setFilter} variant="pill" scroll />
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            {isLoading ? (
              <ActivityIndicator color="#22E06B" />
            ) : isError ? (
              <Text className="text-text-secondary">Couldn&apos;t load tokens. Pull to retry.</Text>
            ) : (
              <Text className="text-text-secondary">No tokens found.</Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
