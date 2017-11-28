const baseConfig = require('./webpack.base');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
    plugins: [
      require.resolve('babel-plugin-transform-decorators-legacy'),
      [
        require.resolve('babel-plugin-import'),
        {
          libraryName: '@tencent/comby-lib-pc',
          libraryDirectory: 'components',
          style: true,
        },
      ],
    ],
    cacheDirectory: true,
    compact: false,
    comments: false,
  },
});
