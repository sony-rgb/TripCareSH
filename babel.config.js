module.exports = function(api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@actions': './actions',
            '@assets': './assets',
            '@config': './config',
            '@components': './components',
            '@data': './data',
            '@lang': './lang',
            '@screens': './screens',
            '@services': './services',
            '@utils': './utils',
          },          
        }
      ],
    ],
  };
};
