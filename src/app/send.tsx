import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NumPad } from '@/components/num-pad';
import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';
import { useSolPrice } from '@/hooks/use-sol-price';
import { useTrade } from '@/hooks/use-trade';

/** SEND ("/send") — amount keypad + recipient. Sends real SOL signed by the Privy wallet. */
export default function SendScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const [sending, setSending] = useState(false);
  const trade = useTrade();
  const { data: solPrice = 0 } = useSolPrice();

  const onSend = () => {
    if (!to.trim()) {
      Alert.alert('Recipient needed', 'Enter a wallet address to send to.');
      return;
    }
    if (!solPrice) {
      Alert.alert('One sec', 'Fetching SOL price — tap Send again.');
      return;
    }
    const lamports = (Number(amount) / solPrice) * 1_000_000_000;
    Alert.alert('Confirm send', `Send $${amount} (≈ ${(lamports / 1e9).toFixed(4)} SOL) to ${to.trim()}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: async () => {
          setSending(true);
          try {
            const sig = await trade.sendSol(to.trim(), lamports);
            Alert.alert('✅ Sent', `On-chain! Tx ${sig.slice(0, 10)}…`, [
              { text: 'Done', onPress: () => router.back() },
            ]);
          } catch (e) {
            Alert.alert('Send failed', e instanceof Error ? e.message : 'Please try again.');
          } finally {
            setSending(false);
          }
        },
      },
    ]);
  };

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
        <PillButton label="Send" onPress={onSend} loading={sending} disabled={amount === '0'} />
      </View>

      <NumPad value={amount} onChange={setAmount} />
    </SafeAreaView>
  );
}
