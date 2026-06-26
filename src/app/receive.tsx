import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { shortAddress } from '@/lib/format';
import { PORTFOLIO } from '@/lib/mock';

/** RECEIVE ("/receive") — show the wallet address + QR for funding. */
export default function ReceiveScreen() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await Clipboard.setStringAsync(PORTFOLIO.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScreenHeader title="Receive" />

      <View className="flex-1 items-center justify-center px-6">
        {/* QR placeholder — a real QR (react-native-qrcode-svg) lands in a later phase */}
        <View className="h-56 w-56 items-center justify-center rounded-3xl bg-white">
          <Ionicons name="qr-code" size={150} color="#0A0D12" />
        </View>

        <Text className="mt-6 text-sm text-text-secondary">Your Solana address</Text>
        <Text className="mt-1 text-center text-base font-medium text-text">
          {shortAddress(PORTFOLIO.walletAddress, 8, 8)}
        </Text>

        <Pressable
          onPress={copy}
          className="mt-6 flex-row items-center gap-2 rounded-full bg-surface2 px-5 py-3 active:opacity-80">
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color="#22E06B" />
          <Text className="font-semibold text-text">{copied ? 'Copied!' : 'Copy address'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
