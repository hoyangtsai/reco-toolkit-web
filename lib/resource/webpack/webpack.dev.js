const fs = require('fs');
const path = require('path');
const baseConfig = require('./webpack.base');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const babelrc = fs.readFileSync(path.resolve(__dirname, '../../../.babelrc'));
const babelObj = JSON.parse(babelrc);

console.log('babelObj: ', babelObj);

module.exports = context => baseConfig(context, {
  devtool: '#source-map',
  entry: {
    app: ['babel-polyfill', `${context.cwd}/client/client.js`],
  },
  output: {
    publicPath: 'http://localhost:9000/',
  },
  cssLoaders: [
    'style-loader',
    'css-loader',
  ],
  sassLoaders: [
    'style-loader',
    'css-loader?modules&importLoaders=2&localIdentName=[local]',
    'sass-loader?outputStyle=expanded',
  ],
  plugins: [
    // new BundleAnalyzerPlugin(),
  ],

  // Tell babel that we want to hot-reload
  babelQuery: {
    presets: [
      'babel-preset-react-hmre',
      'babel-preset-latest',
      'babel-preset-react',
      'babel-preset-stage-0',
    ].map(require.resolve),
    plugins: ['babel-plugin-transform-decorators-legacy'].map(require.resolve),
    cacheDirectory: true,
    compact: false,
    comments: false,
  },
});
