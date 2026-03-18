const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const {
  getBundleModeMetroConfig,
} = require('react-native-worklets/bundleMode');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

module.exports = getBundleModeMetroConfig(getDefaultConfig(__dirname));
