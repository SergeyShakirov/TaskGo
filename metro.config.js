const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: ["js", "json", "ts", "tsx", "jsx"],
  },
  transformer: {
    babelTransformerPath: require.resolve(
      "metro-react-native-babel-transformer"
    ),
  },
};

module.exports = mergeConfig(defaultConfig, config);
