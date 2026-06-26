import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NumPad } from '@/components/num-pad';
import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';

/** SEND ("/send") — amount keypad + recipient address. Wired to Jupiter/transfer in Phase 7. */
export default function SendScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScreenHeader title="Send" />

      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold text-text">${amount}</Text>
        <Text className="mt-2 text-text-secondary">Available $773.98</Text>
      </View>

      <View className="px-4 pb-3">
        <View className="rounded-2xl bg-surface px-4 py-3">
          <Text className="mb-1 text-xs text-text-secondary">Recipient</Text>
          <TextInput
            value={to}
            onChangeText={setTo}
            placeholder="Wallet address or @username"
            placeholderTextColor="#5B6573"
            className="text-base text-text"
          />
        </View>
      </View>

      <View className="px-4">
        <PillButton label="Send" onPress={() => router.back()} disabled={amount === '0'} />
      </View>

      <NumPad value={amount} onChange={setAmount} />
    </SafeAreaView>
  );
}
