const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (!config.resolve) {
    config.resolve = { alias: {} };
  } else if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  config.resolve.alias['react-native-maps'] = require('path').resolve(__dirname, 'web/react-native-maps.js');

  return config;
};
