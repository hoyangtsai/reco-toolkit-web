const path = require('path');

module.exports = reco => class BuildDll extends reco.Command {
  constructor(rawArgv) {
    super(rawArgv);

    this.usage = 'Usage: reco build-dll [options]';
    this.name = 'build-dll';
    this.options = {};
  }

  get description() {
    return 'Build dll js';
  }

  * run(ctx) {
    ctx.env.NODE_ENV = process.env.NODE_ENV || 'production';
    const pkgJson = require(path.join(ctx.cwd, 'package.json'));

    ctx.toolkit = ctx.toolkit = this.helper.getToolkitDir(pkgJson.template && pkgJson.template.toolkit, reco.ctx.recoDir);
    const runBuildDll = require('../scripts/build-dll');
    yield runBuildDll.call(this, ctx);
  }
};
