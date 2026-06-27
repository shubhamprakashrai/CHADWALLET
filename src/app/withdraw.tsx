import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NumPad } from '@/components/num-pad';
import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';

/** WITHDRAW ("/withdraw") — cash out a USD amount. The off-ramp transfer is signed
 *  by the Privy wallet (dev build); here it confirms the amount. */
export default function WithdrawScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');

  const onWithdraw = () => {
    Alert.alert('Confirm withdrawal', `Withdraw $${amount} from your wallet?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScreenHeader title="Withdraw" />

      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold text-text">${amount}</Text>
        <Text className="mt-2 text-text-secondary">Available $773.98</Text>
      </View>

      <View className="px-4">
        <PillButton label="Withdraw" onPress={onWithdraw} disabled={amount === '0'} />
      </View>

      <NumPad value={amount} onChange={setAmount} />
    </SafeAreaView>
  );
}
