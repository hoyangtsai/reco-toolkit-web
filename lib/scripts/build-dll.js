const path = require('path');
const webpack = require('webpack');
const assert = require('assert');
const { rimraf } = require('mz-modules');
const glob = require('glob');
const webpackPromise = require('@tencent/reco-bin/lib/webpack-promise')(webpack);
const createDllConfig = require('../webpack/webpack.dll');
const fse = require('fs-extra');
const fs = require('mz/fs');

const REG_VENDOR_JS = /<script.*vendor-\w+\.js.*/g;
const DLL_LIB = path.resolve(__dirname, '../webpack/lib');

module.exports = function* (ctx) {
  try {
    rimraf.sync(path.resolve(__dirname, '../webpack/lib'));
    this.logger.info('Remove old vendor files succeed in webpack/lib !');
    rimraf.sync(path.resolve(ctx.cwd, './app/public/lib/vendor-*.js'));
    this.logger.info('Remove old vendor files in app/public/lib!');

    const dllConfig = createDllConfig(ctx);
    yield webpackPromise(dllConfig, {
      log: true,
    });
    console.info('Generate dll files succeed!');

    const files = glob.sync('vendor-*.js', {
      cwd: DLL_LIB,
      dot: true,
      nodir: true,
      ignore: ['.git/**', '.svn/**'],
    });
    assert.ok(files.length === 1, `Dir '${DLL_LIB}' find vendor-*.js size is not 1, but ${files.length}`);
    const vendorFileName = files[0];
    const vendorFile = path.resolve(DLL_LIB, `./${vendorFileName}`);
    const distVendorFile = path.resolve(ctx.cwd, `./app/public/lib/${vendorFileName}`);
    yield fse.copy(vendorFile, distVendorFile);
    this.logger.info(`Copy vendorFile from '${vendorFile}' to '${distVendorFile}' succeed!`);

    const indexHtml = path.resolve(ctx.cwd, './client/index.template.html');
    const content = yield fs.readFile(indexHtml, { encoding: 'utf8' });
    yield fs.writeFile(indexHtml, content.replace(REG_VENDOR_JS, ` <script src="/public/lib/${vendorFileName}"></script>`, { encoding: 'utf8' }));
    this.logger.info(`Write vendor script to index template html: '${indexHtml}'`);
  } catch (err) {
    this.logger.error('webpack build dll error: ', err);
  }
};
