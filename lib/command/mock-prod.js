const path = require('path');

module.exports = reco => class MockProd extends reco.Command {
  constructor(rawArgv) {
    super(rawArgv);

    this.usage = 'Usage: reco mock-prod [options]';
    this.name = 'mock-prod';
    this.options = {};
  }

  get description() {
    return 'Mock prod env';
  }

  * run(ctx) {
    Object.assign(ctx.env, {
      NODE_ENV: process.env.NODE_ENV || 'prod-test',
      BABEL_ENV: 'production',
      EGG_SERVER_ENV: 'local',
    });
    const pkgJson = require(path.join(ctx.cwd, 'package.json'));

    ctx.toolkit = ctx.toolkit = this.helper.getToolkitDir(pkgJson.template && pkgJson.template.toolkit, reco.ctx.recoDir);
    this.helper.forkNode('./node_modules/.bin/nodemon', ['server.js', '-w', 'app/', '-w', 'config/'], {
      cwd: this.ctx.cwd,
      env: this.ctx.env,
    });
    this.logger.info(`Run ${this.name} command succeed!`);
  }
};
