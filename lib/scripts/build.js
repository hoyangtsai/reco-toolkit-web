const webpack = require('webpack');
const webpackPromise = require('@tencent/reco-bin/lib/webpack-promise')(webpack);
const createProdConfig = require('../webpack/webpack.prod');
const utils = require('../util/utils');

module.exports = function* (ctx) {
  try {
    const prodConfig = createProdConfig(ctx);
    const finalConfig = utils.mergeWebpackConfig(ctx, prodConfig);
    this.logger.info('Merge user webpack config succeed!');
    utils.dumpConfig(ctx, finalConfig);
    this.logger.info('Dump webpack config succeed!');
    yield webpackPromise(finalConfig, {
      log: true,
    });
    console.log('Webpack build succeed!');
  } catch (err) {
    console.error('webpack build error: ', err);
  }
};

