const Command = require('@tencent/reco-bin');
const path = require('path');

class Server extends Command {

  constructor(rawArgv) {
    super(rawArgv);

    this.usage = 'Usage: reco server [env] [options]';
    this.name = 'server';
    this.options = {
      port: {
        desc: 'http port',
        alias: 'p',
        type: 'number',
        default: 8080,
      },
      open: {
        desc: 'whethe open the browser',
        alias: 'o',
        type: 'boolean',
        default: false,
      },
    };
  }

  get description() {
    return 'Run webpack dev server';
  }

  * run(ctx) {
    const { cwd } = ctx;

    const pkgJson = require(path.join(cwd, 'package.json'));
    if (!pkgJson.template || !pkgJson.template.toolkit) {
      console.error('Current project missing template info, please contact @allanyu to setting it!');
      return;
    }

    const toolkit = pkgJson.template.toolkit;
    const toolkitInfo = require(`${toolkit}/package.json`);
    this.log('toolkitInfo: ', toolkitInfo.name, ', cwd: ', cwd);

    // const babelrc = require('../../.babelrc');

    // require('babel-register')({
    //   // only: /\/client\//,
    //   presets: babelrc.presets,
    //   plugins: babelrc.plugins,
    // });

    const startWebpackServer = require('../resource/webpack/setup-dev-server');
    startWebpackServer({
      cwd,
      toolkit,
    });
  }
}

module.exports = Server;
