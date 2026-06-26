import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SegmentTabs } from '@/components/segment-tabs';
import { TokenRow } from '@/components/token-row';
import { useTrending } from '@/hooks/use-trending';

const FILTERS = ['Trending', 'New', 'Most Traded', 'Gainers', 'Stocks'] as const;

/**
 * MEMES ("/memes") — the Trending tokens list (a required screen), now powered
 * by REAL Birdeye data via useTrending(). Pull-to-refresh calls refetch() for a
 * genuine network refresh; loading/error states come from React Query.
 */
export default function MemesScreen() {
  const [filter, setFilter] = useState<string>('Trending');
  const { data: tokens = [], isLoading, isError, isRefetching, refetch } = useTrending();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <FlatList
        data={tokens}
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
