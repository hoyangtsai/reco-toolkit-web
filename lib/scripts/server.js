const path = require('path');
const webpack = require('webpack');
const Express = require('express');
const { getGlobEnv } = require('@tencent/nodinx-utils');
const createConfig = require('../webpack/webpack.dev');

Object.assign(global, getGlobEnv());

module.exports = function* (ctx) {
  let clientConfig = createConfig(ctx);
  // modify client config to work with hot middleware
  clientConfig.entry.app = [
    ...new Set([
      'babel-polyfill',
      'webpack-hot-middleware/client?path=http://localhost:9000/__webpack_hmr',
      'react-hot-loader/patch',
    ].concat(clientConfig.entry.app)),
  ];
  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin());

  clientConfig = this.helper.mergeWebpackConfig(ctx, clientConfig);
  this.logger.info('Merge user webpack config succeed!');
  this.helper.dumpConfig(ctx, clientConfig);
  this.logger.info('Dump webpack config succeed!');

  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    // eslint-disable-line
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
    },
  });
  const app = new Express();
  app.use((req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
      'Access-Control-Max-Age': 1000000,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Content-Length, X-Requested-With',
    });
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.use(devMiddleware);
  let indexHTML = null;
  app.use('/index.html', (req, res) => {
    if (indexHTML) {
      res.set('content-type', 'text/html;charset=utf-8');
      res.send(indexHTML);
    } else {
      res.send(404);
    }
  });
  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem;
    const filePath = path.join(clientConfig.output.path, 'index.html');
    if (fs.existsSync(filePath)) {
      indexHTML = fs.readFileSync(filePath, 'utf-8');
    }
  });

  // hot middleware
  app.use(require("webpack-hot-middleware")(clientCompiler)); // eslint-disable-line
  app.listen(9000, (err) => {
    if (err) {
      console.log('Boostrap webpack dev server failed, err is ', err);
    } else {
      console.log('Bootstrap webpack dev server run succeed!');
    }
  });
};
