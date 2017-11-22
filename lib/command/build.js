const path = require('path');

module.exports = reco => class Build extends reco.Command {
  constructor(rawArgv) {
    super(rawArgv);

    this.usage = 'Usage: reco build [env] [options]';
    this.name = 'build';
    this.options = {};
  }

  get description() {
    return 'Build react code';
  }

  * run(ctx) {
    process.env.NODE_ENV = 'production';
    const pkgJson = require(path.join(ctx.cwd, 'package.json'));

    if (!pkgJson.template || !pkgJson.template.toolkit) {
      this.error('Current project missing template info, please contact @allanyu to setting it!');
    }

    ctx.toolkit = pkgJson.template.toolkit;
    const runBuild = require('../scripts/build');
    yield runBuild(ctx);
  }
};
