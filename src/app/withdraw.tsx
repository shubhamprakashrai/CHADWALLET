import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NumPad } from '@/components/num-pad';
import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';

/** WITHDRAW ("/withdraw") — cash out a USD amount. Off-ramp wired in a later phase. */
export default function WithdrawScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScreenHeader title="Withdraw" />

      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold text-text">${amount}</Text>
        <Text className="mt-2 text-text-secondary">Available $773.98</Text>
      </View>

      <View className="px-4">
        <PillButton label="Withdraw" onPress={() => router.back()} disabled={amount === '0'} />
      </View>

      <NumPad value={amount} onChange={setAmount} />
    </SafeAreaView>
  );
}
