
// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.base');
const CleanPlugin = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (context) => {
  const resolve = dir => path.resolve(context.cwd, dir);
  return baseConfig({
    // In production, we skip all hot-reloading stuff
    entry: {
      app: ['babel-polyfill', `${context.cwd}/client/client.js`],
    },

    cssLoaders: ExtractTextPlugin.extract({
      use: [
        'css-loader?minimize&name=css/[name]-[hash:5].[ext]&sourceMap',
      ],
      fallback: 'style-loader',
    }),
    sassLoaders: ExtractTextPlugin.extract({
      use: [
        'css-loader?modules&importLoaders=2&localIdentName=[local]',
        'sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
      ],
      fallback: 'style-loader',
    }),
    plugins: [
      // new BundleAnalyzerPlugin(),
      new CleanPlugin(['dist'], {
        root: resolve('./app/public'),
        verbose: true,
        dry: false,
      }),
      // this is needed in webpack 2 for minifying CSS
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new ExtractTextPlugin({
        filename: 'css/[name].[chunkhash:5].css',
        disable: false,
        allChunks: true,
      }),
      // Minify and optimize the JavaScript
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
  });
};
