// Polyfills MUST load before anything else so Privy's crypto / wallet code works.
// React Native has no built-in crypto, TextEncoder or Buffer — these add them.
import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import 'react-native-url-polyfill/auto'; // full URL() for @supabase/supabase-js

// Then hand off to expo-router's normal entry.
import 'expo-router/entry';
