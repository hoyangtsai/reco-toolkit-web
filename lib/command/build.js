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
    ctx.env.NODE_ENV = process.env.NODE_ENV || 'production';
    const pkgJson = require(path.join(ctx.cwd, 'package.json'));

    ctx.toolkit = ctx.toolkit = this.helper.getToolkitDir(pkgJson.template && pkgJson.template.toolkit, reco.ctx.recoDir);
    const runBuild = require('../scripts/build');
    yield runBuild(ctx);
  }
};
