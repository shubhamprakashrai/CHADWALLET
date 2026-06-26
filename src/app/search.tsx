import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { SegmentTabs } from '@/components/segment-tabs';
import { TokenRow } from '@/components/token-row';
import { useRecentSearches } from '@/hooks/use-recent-searches';
import { useTrending } from '@/hooks/use-trending';

const FALLBACK_RECENTS = ['@toly', '# unc', 'unc'];
const EXPLORE = ['Trending', 'New', 'Most Traded', 'Stocks'] as const;

/** SEARCH ("/search") — modal overlay; searches the live trending token list. */
export default function SearchScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('Trending');
  const { data: tokens = [] } = useTrending();
  const { recents, add, clear } = useRecentSearches(user?.id);

  const recentChips = recents.length ? recents : FALLBACK_RECENTS;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter(
      (t) => t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q),
    );
  }, [query, tokens]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* search input row */}
      <View className="flex-row items-center gap-3 px-4 py-2">
        <Pressable onPress={() => router.back()} hitSlop={10} className="active:opacity-60">
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </Pressable>
        <View className="h-10 flex-1 flex-row items-center gap-2 rounded-full bg-surface px-4">
          <Ionicons name="search" size={18} color="#5B6573" />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => query.trim() && add(query)}
            returnKeyType="search"
            placeholder="Tokens, wallets, #tweets"
            placeholderTextColor="#5B6573"
            className="flex-1 text-sm text-text"
          />
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TokenRow token={item} />}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          query.trim() ? null : (
            <View className="px-4 pt-2">
              {/* recents */}
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-text-secondary">Recents</Text>
                <Pressable onPress={() => clear()} hitSlop={8}>
                  <Text className="text-sm text-primary">Clear</Text>
                </Pressable>
              </View>
              <View className="mb-5 flex-row flex-wrap gap-2">
                {recentChips.map((r) => (
                  <Pressable
                    key={r}
                    onPress={() => setQuery(r.replace(/^[@#]\s*/, ''))}
                    className="rounded-full bg-surface2 px-3 py-1.5 active:opacity-70">
                    <Text className="text-sm text-text">{r}</Text>
                  </Pressable>
                ))}
              </View>
              {/* explore filters */}
              <Text className="mb-2 text-sm font-semibold text-text-secondary">Explore</Text>
              <View className="mb-2">
                <SegmentTabs tabs={EXPLORE} value={filter} onChange={setFilter} variant="pill" scroll />
              </View>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
