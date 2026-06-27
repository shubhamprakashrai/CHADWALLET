import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NumPad } from '@/components/num-pad';
import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';
import { useSolPrice } from '@/hooks/use-sol-price';

/**
 * DEPOSIT  ("/deposit") — presented as a modal (see root _layout).
 * Enter a USD amount on the keypad; we show the live SOL equivalent + the MoonPay
 * provider. (The real MoonPay on-ramp opens with a MoonPay key.)
 */
export default function DepositScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('20');
  const { data: solPrice = 0 } = useSolPrice();
  const sol = solPrice ? (Number(amount || '0') / solPrice).toFixed(3) : '—';

  const onDeposit = () => {
    Alert.alert('Deposit via MoonPay', `Add $${amount} (≈ ${sol} SOL) to your wallet.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: () => router.back() },
    ]);
  };

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
        <PillButton label="Deposit" onPress={onDeposit} />
      </View>

      <NumPad value={amount} onChange={setAmount} />
    </SafeAreaView>
  );
}
