module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './app',
            '@components': './app/components',
            '@constants': './app/constants',
            '@features': './app/features',
            '@hooks': './app/hooks',
            '@services': './app/services',
            '@types': './app/types',
          },
        },
      ],
    ],
  };
};
