import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * TABS LAYOUT  (src/app/(tabs)/_layout.tsx)
 * -----------------------------------------
 * The folder name "(tabs)" is wrapped in parentheses, which makes it a
 * ROUTE GROUP: it groups screens under one navigator but DOES NOT appear in
 * the URL. So `(tabs)/index.tsx` is just "/", not "/(tabs)".
 *
 * Each file in this folder = one tab:
 *   index.tsx    -> "/"          Home feed
 *   memes.tsx    -> "/memes"     Trending tokens
 *   discover.tsx -> "/discover"  X feed
 *   account.tsx  -> "/account"   Portfolio
 *
 * We pass a custom `tabBar` so the bar matches ChadWallet's dark + green look
 * instead of the default iOS/Android bar.
 */

// icon for each route (inactive name, active name)
const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; label: string }> = {
  index: { on: 'home', off: 'home-outline', label: 'Home' },
  memes: { on: 'flame', off: 'flame-outline', label: 'Memes' },
  discover: { on: 'compass', off: 'compass-outline', label: 'Discover' },
  account: { on: 'person', off: 'person-outline', label: 'Account' },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      // hide the default header + use our custom bar
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <View
          style={{ paddingBottom: insets.bottom || 10 }}
          className="flex-row border-t border-border bg-bg pt-2">
          {state.routes.map((route, index) => {
            const cfg = ICONS[route.name];
            if (!cfg) return null;
            const focused = state.index === index;
            const color = focused ? '#22E06B' : '#5B6573';

            return (
              <Pressable
                key={route.key}
                // navigating by route name is how expo-router switches tabs
                onPress={() => navigation.navigate(route.name)}
                className="flex-1 items-center gap-1 active:opacity-70">
                <Ionicons name={focused ? cfg.on : cfg.off} size={22} color={color} />
                <Text style={{ color }} className="text-[11px] font-medium">
                  {cfg.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}>
      {/* Order here controls the left-to-right order of the tabs. */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="memes" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
