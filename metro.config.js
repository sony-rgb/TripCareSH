const {getDefaultConfig} = require('expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const {transformer, resolver} = config;

  config.transformer = {
    ...transformer,
    env: {
      EXPO_PUBLIC_API_URL_PROD: process.env.EXPO_PUBLIC_API_URL_PROD,
    },
    //babelTransformerPath: require.resolve('react-native-svg-transformer'),
    //assetPlugins: ['expo-asset/tools/hashAssetFiles']
  };
  
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
    extraNodeModules: {
      '@actions': path.resolve(__dirname, './actions'),
      '@assets': path.resolve(__dirname, './assets'),
      '@components': path.resolve(__dirname, './components'),
      '@config': path.resolve(__dirname, './config'),
      '@data': path.resolve(__dirname, './data'),
      '@lang': path.resolve(__dirname, './lang'),
      '@screens': path.resolve(__dirname, './screens'),
      '@services': path.resolve(__dirname, './services'),
      '@utils': path.resolve(__dirname, './utils'),
    }
  };

  return config;
})(); 