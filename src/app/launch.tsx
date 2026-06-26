import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';

/**
 * LAUNCH ("/launch") — "Launch Meme Coin" form: image, name, ticker, socials.
 * Next would lead to the Acquire/pay step; for the shell it just closes.
 */
export default function LaunchScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScreenHeader title="Launch Meme Coin" actions={[{ icon: 'trash-outline', color: '#8B95A1' }]} />

      <ScrollView contentContainerClassName="px-4 pt-2" keyboardShouldPersistTaps="handled">
        {/* image picker placeholder */}
        <Pressable className="aspect-square w-full items-center justify-center rounded-2xl bg-surface active:opacity-80">
          <Ionicons name="image-outline" size={48} color="#5B6573" />
          <Text className="mt-2 text-sm text-text-secondary">Add coin image</Text>
        </Pressable>

        <Field label="Name" value={name} onChange={setName} placeholder="e.g. unc" />
        <Field label="Ticker" value={ticker} onChange={setTicker} placeholder="e.g. UNC" autoCap />
        <Field
          label="Social Links"
          optional
          value=""
          onChange={() => {}}
          placeholder="https://x.com/…"
        />
      </ScrollView>

      <View className="px-4 pb-2">
        <PillButton label="Next" onPress={() => router.back()} disabled={!name || !ticker} />
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  optional,
  autoCap,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  placeholder: string;
  optional?: boolean;
  autoCap?: boolean;
}) {
  return (
    <View className="mt-5">
      <Text className="mb-1.5 text-sm font-semibold text-text">
        {label} {optional && <Text className="font-normal text-text-tertiary">(optional)</Text>}
      </Text>
      <View className="flex-row items-center rounded-xl bg-surface px-4 py-3.5">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#5B6573"
          autoCapitalize={autoCap ? 'characters' : 'none'}
          className="flex-1 text-base text-text"
        />
      </View>
    </View>
  );
}
