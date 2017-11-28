const path = require('path');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');

module.exports = (ctx, options) => {
  const resolve = dir => path.resolve(ctx.cwd, dir);
  console.log('Current NODE_ENV: ', ctx.env.NODE_ENV);
  const paths = {
    src: folder => path.resolve(ctx.cwd, './client/', folder),
    modules: folder => path.resolve(ctx.cwd, './node_modules/', folder),
  };

  return ({
    devtool: options.devtool,
    context: ctx.cwd,
    target: 'web',
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    },
    // target: 'web', // Make web variables accessible to webpack, e.g. window
    stats: { colors: true }, // Don't show stats in the console
    entry: options.entry,
    output: Object.assign({ // Compile into js/build.js
      path: resolve('./app/public/dist'),
      publicPath: '/public/dist/',
      filename: '[name].[chunkhash:5].js',
    }, options.output), // Merge with env dependent settings
    module: {
      noParse: /(es6-promise|babel-polyfill)\.js/,
      rules: [
        {
          test: /\.jsx?$/, // Transform all .js files required somewhere with Babel
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: options.babelQuery,
          },
        },
        {
          test: /\.css$/,
          use: options.cssLoaders,
        },
        {
          test: /\.scss$/,
          use: options.sassLoaders,
        },
        {
          test: /\.(png|jpg|gif|svg)(\?.*)?$/,
          use: 'url-loader?limit=1&name=public/images/[name].[ext]?[hash:5]',
        },
        {
          test: /\.woff2?(\?\S*)?$/,
          use: 'url-loader?name=fonts/[name].[ext]&mimetype=application/font-woff&limit=1',
        },
        {
          test: /\.ttf(\?\S*)?$/,
          use: 'url-loader?name=fonts/[name].[ext]&mimetype=application/octet-stream&limit=1',
        },
        {
          test: /\.eot(\?\S*)?$/,
          use: 'file-loader?name=fonts/[name].[ext]&mimetype=application/vnd.ms-fontobject&limit=1',
        }],
    },
    plugins: options.plugins.concat([
      new ProgressBarPlugin({
        format: `build [:bar] ${chalk.green.bold(':percent')
          } (:elapsed seconds) ${chalk.gray(':msg')}`,
        renderThrottle: 100,
        clear: false,
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./lib/vendor.json'), // eslint-disable-line
      }),
      // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
      // inside your code for any environment checks; UglifyJS will automatically
      // drop any unreachable code.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ctx.env.NODE_ENV),
        __CLIENT__: true,
        __SERVER__: false,
        __DEVELOPMENT__: ctx.env.NODE_ENV === 'development',
        __PRODUCTION__: ctx.env.NODE_ENV === 'production',
        __DEVTOOLS__: false,
      }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
      new HTMLPlugin({
        template: `${ctx.cwd}/client/index.template.html`,
      }),
    ]),
    resolveLoader: {
      modules: [
        'node_modules',
        `${ctx.toolkit}/node_modules`,
        path.resolve(ctx.toolkit, '../../'), // reco node_modules dir
      ],
    },
    resolve: {
      modules: [
        'client',
        'node_modules',
        `${ctx.toolkit}/node_modules`,
        path.resolve(ctx.toolkit, '../../'), // reco node_modules dir
      ],
      extensions: [
        '.js',
        '.jsx',
      ],
      mainFields: [
        'main',
        'jsnext:main',
        'browser',
      ],
      alias: [
        'store',
        'component',
        'container',
        'style',
        'util',
        'image',
      ].reduce((sum, folder) => ((sum[folder] = paths.src(folder)) && sum), {
        react: paths.modules('react'),
        'react-dom': paths.modules('react-dom/cjs/react-dom.production.min.js'),
      }),
    },
  });
};

