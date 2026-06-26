import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NumPad } from '@/components/num-pad';
import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';

const SOL_PRICE = 19.82; // mock; Phase 5 pulls live SOL/USD

/**
 * DEPOSIT  ("/deposit") — presented as a modal (see root _layout).
 * Enter a USD amount on the keypad; we show the SOL equivalent + a MoonPay
 * provider chip, matching the real Deposit SOL screen.
 */
export default function DepositScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('20');
  const sol = (Number(amount || '0') / SOL_PRICE).toFixed(3);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScreenHeader title="Deposit SOL" />

      {/* big amount */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold text-text">${amount}</Text>
      </View>

      {/* provider + sol equivalent */}
      <View className="flex-row items-center justify-between px-5 pb-3">
        <Pressable className="flex-row items-center gap-2 active:opacity-70">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Text className="text-xs font-bold text-primary-fg">M</Text>
          </View>
          <Text className="font-semibold text-text">Via MoonPay</Text>
          <Text className="text-text-secondary">⌄</Text>
        </Pressable>
        <Text className="text-text-secondary">{sol} SOL</Text>
      </View>

      <View className="px-4">
        <PillButton label="Deposit" onPress={() => router.back()} />
      </View>

      <NumPad value={amount} onChange={setAmount} />
    </SafeAreaView>
  );
}
