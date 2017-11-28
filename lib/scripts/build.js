const webpack = require('webpack');
const webpackPromise = require('@tencent/reco-bin/lib/webpack-promise')(webpack);
const createProdConfig = require('../webpack/webpack.prod');

module.exports = function* (ctx) {
  try {
    const prodConfig = createProdConfig(ctx);
    const finalConfig = this.helper.mergeWebpackConfig(ctx, prodConfig);
    this.logger.info('Merge user webpack config succeed!');
    this.helper.dumpConfig(ctx, finalConfig);
    this.logger.info('Dump webpack config succeed!');
    yield webpackPromise(finalConfig, {
      log: true,
    });
    console.log('Webpack build succeed!');
  } catch (err) {
    console.error('webpack build error: ', err);
  }
};

