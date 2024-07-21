if (process.env.IS_WEB) {
    // to resolve css file properly
    // Learn more https://docs.expo.io/guides/customizing-metro
    const { getDefaultConfig } = require('expo/metro-config');

    /** @type {import('expo/metro-config').MetroConfig} */
    const config = getDefaultConfig(__dirname);

    module.exports = config;
} else {
    const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
    // to resolve require(./path_to_asset) properly
    /**
    * Metro configuration
    * https://reactnative.dev/docs/metro
    *
    * @type {import('metro-config').MetroConfig}
    */
    const config = {};

    module.exports = mergeConfig(getDefaultConfig(__dirname), config);
}