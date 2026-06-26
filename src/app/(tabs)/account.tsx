import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { ActionCircle } from '@/components/action-circle';
import { Avatar } from '@/components/avatar';
import { ChangeBadge } from '@/components/change-badge';
import { LineChart } from '@/components/line-chart';
import { SegmentTabs } from '@/components/segment-tabs';
import { usePortfolio } from '@/hooks/use-portfolio';
import { compact, formatUsd } from '@/lib/format';
import { HOLDINGS, PORTFOLIO, RANGE_TABS } from '@/lib/mock';

/**
 * ACCOUNT  ("/account") — the user portfolio (a required screen).
 * Net-worth header + chart, the Send/Receive/Deposit/Withdraw action row,
 * Holdings list, a Rewards card, and a floating wallet-address pill.
 */
export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [range, setRange] = useState<string>('1Y');
  const [copied, setCopied] = useState(false);

  // the real embedded-wallet address from auth (falls back to mock if missing)
  const walletAddress = user?.walletAddress ?? PORTFOLIO.walletAddress;

  // real holdings + net worth (Alchemy + Jupiter); falls back to demo data
  const { data: portfolio, isRefetching, refetch } = usePortfolio(walletAddress);
  const holdings = portfolio?.holdings ?? HOLDINGS;
  const netWorth = portfolio?.netWorth ?? PORTFOLIO.netWorth;

  const copyAddress = useCallback(async () => {
    await Clipboard.setStringAsync(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }, [walletAddress]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScrollView
        contentContainerClassName="pb-28"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#22E06B" />
        }>
        {/* top: search + history */}
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-1">
          <Ionicons name="time-outline" size={22} color="#5B6573" />
          <Pressable
            onPress={() => router.push('/search')}
            className="h-10 flex-1 flex-row items-center gap-2 rounded-full bg-surface px-4">
            <Ionicons name="search" size={18} color="#5B6573" />
            <Text className="text-sm text-text-tertiary">Search for tokens or wallets</Text>
          </Pressable>
        </View>

        {/* net worth */}
        <View className="px-4">
          <Text className="text-4xl font-bold text-text">{formatUsd(netWorth)}</Text>
          <View className="mt-1 flex-row items-center gap-2">
            <ChangeBadge change={PORTFOLIO.changeAbs} arrow />
            <Text className="text-sm text-text-secondary">{PORTFOLIO.changePeriod}</Text>
          </View>
        </View>

        {/* chart + range tabs */}
        <View className="mt-4 px-2">
          <LineChart data={PORTFOLIO.series} height={170} />
        </View>
        <View className="mt-3 px-4">
          <SegmentTabs tabs={RANGE_TABS} value={range} onChange={setRange} variant="pill" />
        </View>

        {/* action row */}
        <View className="mt-6 flex-row justify-around px-6">
          <ActionCircle icon="arrow-up" label="Send" onPress={() => router.push('/send')} />
          <ActionCircle icon="arrow-down" label="Receive" onPress={() => router.push('/receive')} />
          <ActionCircle icon="add" label="Deposit" onPress={() => router.push('/deposit')} />
          <ActionCircle icon="arrow-redo" label="Withdraw" onPress={() => router.push('/withdraw')} />
        </View>

        {/* holdings */}
        <Text className="mb-1 mt-7 px-4 text-xl font-bold text-text">Holdings</Text>
        {holdings.map((h) => (
          <View key={h.tokenId} className="flex-row items-center gap-3 px-4 py-3">
            <Avatar label={h.symbol} color={h.color} uri={h.logoURI} size={40} />
            <View className="flex-1">
              <Text className="text-[15px] font-semibold text-text">{h.name}</Text>
              <Text className="text-xs text-text-secondary">{h.amount}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[15px] font-semibold text-text">{formatUsd(h.value)}</Text>
              <ChangeBadge change={h.change} />
            </View>
          </View>
        ))}

        {/* rewards */}
        <View className="mx-4 mt-4 rounded-2xl bg-surface p-4">
          <Text className="text-base font-bold text-text">Rewards</Text>
          <Text className="mt-1 text-sm text-text-secondary">Earn 30% of your friends' fees</Text>
          <View className="mt-3 flex-row gap-2">
            {['Claimed', 'Creator', 'Referral'].map((r) => (
              <View key={r} className="flex-1 items-center rounded-xl bg-surface2 py-3">
                <Text className="text-xs text-text-secondary">{r}</Text>
                <Text className="mt-1 text-sm font-semibold text-text">${compact(0)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* signed-in account + sign out */}
        <View className="mx-4 mt-4 flex-row items-center gap-3 rounded-2xl bg-surface p-4">
          <Avatar label={user?.email ?? 'C'} color="#22E06B" size={36} />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-text">{user?.email ?? 'Guest'}</Text>
            <Text className="text-xs text-text-secondary capitalize">
              {user ? `${user.method} login` : 'Not signed in'}
            </Text>
          </View>
          <Pressable
            onPress={logout}
            className="rounded-full bg-surface2 px-4 py-2 active:opacity-70">
            <Text className="text-sm font-semibold text-danger">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* floating wallet-address pill */}
      <Pressable
        onPress={copyAddress}
        className="absolute bottom-4 self-center flex-row items-center gap-2 rounded-full bg-surface2 px-4 py-2.5 active:opacity-80">
        <Ionicons name={copied ? 'checkmark' : 'wallet-outline'} size={16} color="#22E06B" />
        <Text className="text-sm font-semibold text-text">
          {copied ? 'Copied!' : walletAddress.slice(0, 6)}
        </Text>
        <Ionicons name="copy-outline" size={14} color="#8B95A1" />
      </Pressable>
    </SafeAreaView>
  );
}
