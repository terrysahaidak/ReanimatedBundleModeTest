const workletsPluginOptions = {
  bundleMode: true,
  strictGlobal: true, // optional, but recommended
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [['react-native-worklets/plugin', workletsPluginOptions]],
};
