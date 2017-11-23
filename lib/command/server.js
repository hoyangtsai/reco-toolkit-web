const path = require('path');
const runServer = require('../scripts/server');

module.exports = (reco) => {
  class ServerCommand extends reco.Command {

    constructor(rawArgv) {
      super(rawArgv);

      this.usage = 'Usage: reco server|dev [env] [options]';
      this.name = 'server';
      this.options = {
        env: {
          desc: 'current env',
          alias: 'e',
          type: 'string',
          default: 'development',
        },
        open: {
          desc: 'whether open the browser',
          alias: 'o',
          type: 'boolean',
          default: false,
        },
        port: {
          desc: 'webpack dev server port',
          alias: 'p',
          type: 'number',
          default: 9000,
        },
        nodinx: {
          desc: 'whether startup nodinx server',
          type: 'boolean',
          default: false,
        },
      };
    }

    get description() {
      return 'Run webpack dev server';
    }

    * run(ctx) {
      const { cwd, argv } = ctx;
      process.env.EGG_SERVER_ENV = 'local';
      ctx.env.NODE_ENV = process.env.NODE_ENV || 'development';

      this.logger.info(`${this.name} reco dir: `, reco.context.recoDir);

      const pkgJson = require(path.join(cwd, 'package.json'));
      ctx.toolkit = this.helper.getToolkitDir(pkgJson.template && pkgJson.template.toolkit, reco.ctx.recoDir);

      const toolkitInfo = require(`${ctx.toolkit}/package.json`);
      this.logger.info('toolkit info : ', {
        name: toolkitInfo.name,
        dir: ctx.toolkit,
        cwd,
      });

      if (argv.nodinx) {
        this.helper.forkNode('./node_modules/.bin/nodemon', ['server.js', '-w', 'app/', '-w', 'config/'], {
          cwd,
          env: this.ctx.env,
        });
      }
      runServer(ctx);
    }
  }

  ServerCommand.alias = 'dev';

  return ServerCommand;
};
