const webpack = require('webpack');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');

const vendor1 = [
  'babel-polyfill',
  'react',
  'react-dom',
  'classnames',
  'axios',
  'redux',
  'react-router-dom',
  'history',
  'redux-actions',
  'redux-logger',
  'redux-thunk',
  'react-redux',
  'react-router-redux',
];

const vendor = vendor1.concat([
  'immutable',
  'async-validator',
  'querystring',
]);

module.exports = ctx => ({
  context: ctx.toolkit,
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: '[name]-[chunkhash:5].js',
    library: '[name]',
  },
  entry: {
    vendor,
  },
  resolve: {
    modules: [
      `${ctx.toolkit}/node_modules`,
      path.resolve(ctx.toolkit, '../../'), // reco node_modules dir
    ],
    alias: {
      react: path.resolve(ctx.toolkit, './node_modules/react'),
      'react-dom': path.resolve(ctx.toolkit, './node_modules/react-dom/cjs/react-dom.production.min.js'),
    },
  },
  resolveLoader: {
    modules: [
      `${ctx.toolkit}/node_modules`,
      path.resolve(ctx.toolkit, '../../'), // reco node_modules dir
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: `build [:bar] ${chalk.green.bold(':percent')
        } (:elapsed seconds) ${chalk.gray(':msg')}`,
      renderThrottle: 100,
      clear: false,
    }),
    new webpack.DllPlugin({
      path: path.resolve(__dirname, './lib/[name].json'),
      name: '[name]',
      context: __dirname,
    }),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
        warnings: false,
      },
      verbose: true,
      comment: true,
      mangle: true,
      sourceMap: false,
    }),
  ],
})
;
