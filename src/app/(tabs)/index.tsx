import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KolCard } from '@/components/kol-card';
import { SegmentTabs } from '@/components/segment-tabs';
import { TokenRow } from '@/components/token-row';
import { useTrending } from '@/hooks/use-trending';
import { HOME_TABS, KOL_TRADES } from '@/lib/mock';

/**
 * HOME  ("/")  — the live trading feed.
 * Tabs: Live / KOLs / # Memecoin / Trending. Live & KOLs show trader cards
 * (mock — the KOL feed needs Codex, deferred); Trending / # Memecoin show the
 * real Birdeye token list via useTrending().
 */
export default function HomeScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<string>('KOLs');

  const { data: tokens = [], isRefetching, refetch } = useTrending();

  // the KOL feed is still mock, so it keeps a simple simulated refresh
  const [kolRefreshing, setKolRefreshing] = useState(false);
  const onKolRefresh = useCallback(() => {
    setKolRefreshing(true);
    setTimeout(() => setKolRefreshing(false), 900);
  }, []);

  const showTokens = tab === 'Trending' || tab === '# Memecoin';

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* top search bar — tapping it opens the search modal */}
      <View className="flex-row items-center gap-3 px-4 pb-2 pt-1">
        <Ionicons name="help-circle-outline" size={24} color="#5B6573" />
        <Pressable
          onPress={() => router.push('/search')}
          className="h-10 flex-1 flex-row items-center gap-2 rounded-full bg-surface px-4">
          <Ionicons name="search" size={18} color="#5B6573" />
          <Text className="text-sm text-text-tertiary">Tokens, wallets, #tweets</Text>
        </Pressable>
        <Ionicons name="copy-outline" size={22} color="#5B6573" />
      </View>

      {/* feed tabs */}
      <View className="border-b border-border px-4 pb-2">
        <SegmentTabs tabs={HOME_TABS} value={tab} onChange={setTab} variant="text" scroll />
      </View>

      {showTokens ? (
        <FlatList
          data={tokens}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => <TokenRow token={item} />}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#22E06B" />
          }
        />
      ) : (
        <FlatList
          data={KOL_TRADES}
          keyExtractor={(k) => k.id}
          renderItem={({ item }) => <KolCard trade={item} />}
          refreshControl={
            <RefreshControl refreshing={kolRefreshing} onRefresh={onKolRefresh} tintColor="#22E06B" />
          }
        />
      )}
    </SafeAreaView>
  );
}
