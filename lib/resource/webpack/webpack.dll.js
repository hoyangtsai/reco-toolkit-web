const webpack = require('webpack');
const path = require('path');

const vendor1 = [
  'babel-polyfill',
  'react',
  'react-dom',
  'react-router-dom',
  'history',
  'classnames',
  'axios',
];

const vendor = vendor1.concat([
  'redux',
  'redux-actions',
  'redux-logger',
  'redux-thunk',
  'react-redux',
  'react-router-redux',
  'immutable',
  'async-validator',
  'querystring',
]);

module.exports = {
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: '[name]-[chunkhash:5].js',
    library: '[name]',
  },
  entry: {
    vendor,
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    },
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'webpack/lib/[name].json',
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
};
