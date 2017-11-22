const webpack = require('webpack');
const webpackPromise = require('@tencent/reco-bin/lib/webpack-promise')(webpack);
const createProdConfig = require('../webpack/webpack.prod');

module.exports = function* (ctx) {
  const prodConfig = createProdConfig(ctx);
  try {
    yield webpackPromise(prodConfig, {
      log: true,
    });
    console.log('Webpack build succeed!');
  } catch (err) {
    console.error('webpack build error: ', err);
  }
};

