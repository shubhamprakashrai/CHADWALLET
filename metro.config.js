// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Privy pulls in `jose`, whose package exports default to a Node build that
// imports node:util/zlib (absent in React Native). Prefer the browser/RN
// conditions so Metro resolves jose's RN-safe build.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

module.exports = withNativeWind(config, { input: './src/global.css' });
