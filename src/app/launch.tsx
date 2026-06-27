import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';

/**
 * LAUNCH ("/launch") — "Launch Meme Coin" form: image, name, ticker, socials.
 * The image picker + form work; tapping Launch validates and confirms. The real
 * on-chain mint (pump.fun-style) needs the Privy wallet, wired in the trading phase.
 */
export default function LaunchScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [social, setSocial] = useState('');
  const [launching, setLaunching] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add a coin image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const launch = async () => {
    if (!name || !ticker) return;
    setLaunching(true);
    // demo: pretend to mint. Real launch signs + sends with the Privy wallet.
    await new Promise((r) => setTimeout(r, 1200));
    setLaunching(false);
    Alert.alert('🚀 Coin launched!', `$${ticker.toUpperCase()} (${name}) is live.`, [
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScreenHeader
        title="Launch Meme Coin"
        actions={[{ icon: 'trash-outline', color: '#8B95A1', onPress: () => setImage(null) }]}
      />

      <ScrollView contentContainerClassName="px-4 pt-2" keyboardShouldPersistTaps="handled">
        {/* image picker — tap to choose from the photo library */}
        <Pressable
          onPress={pickImage}
          className="aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-surface active:opacity-80">
          {image ? (
            <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          ) : (
            <>
              <Ionicons name="image-outline" size={48} color="#5B6573" />
              <Text className="mt-2 text-sm text-text-secondary">Add coin image</Text>
            </>
          )}
        </Pressable>

        <Field label="Name" value={name} onChange={setName} placeholder="e.g. unc" />
        <Field label="Ticker" value={ticker} onChange={setTicker} placeholder="e.g. UNC" autoCap />
        <Field label="Social Links" optional value={social} onChange={setSocial} placeholder="https://x.com/…" />
      </ScrollView>

      <View className="px-4 pb-2">
        <PillButton
          label="Launch Coin"
          loading={launching}
          onPress={launch}
          disabled={!name || !ticker}
        />
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
