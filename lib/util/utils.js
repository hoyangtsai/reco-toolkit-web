const util = require('util');
const is = require('is-type-of');
const fs = require('fs');
const path = require('path');
const webpackMerge = require('webpack-merge');

module.exports = {
  convertObject,

  mergeWebpackConfig(ctx, clientConfig) {
    const recoConfigFile = `${ctx.cwd}/config/reco-config.js`;
    const isDev = ctx.env.NODE_ENV === 'development';
    if (fs.existsSync(recoConfigFile)) {
      const recoConfig = require(recoConfigFile);
      const webpackConfig = recoConfig.webpack;
      if (webpackConfig) {
        const { common, env = {} } = webpackConfig;
        return webpackMerge(clientConfig, common, (isDev ? env.development : env.production) || {});
      }
    }

    return clientConfig;
  },

  dumpConfig(ctx, clientConfig) {
    // dump config
    const json = Object.assign({}, clientConfig);
    const isDev = ctx.env.NODE_ENV === 'development';
    convertObject(json, []);
    const dumpFile = path.join(ctx.cwd, isDev ? 'run/webpack.development.json' : 'run/webpack.production.json');
    fs.writeFileSync(dumpFile, JSON.stringify(json, null, 2));
  },
};

function convertObject(obj, ignore) {
  if (!is.array(ignore)) ignore = [ignore];
  for (const key of Object.keys(obj)) {
    obj[key] = convertValue(key, obj[key], ignore);
  }
  return obj;
}

function convertValue(key, value, ignore) {
  if (is.nullOrUndefined(value)) return value;

  let hit;
  for (const matchKey of ignore) {
    if (typeof matchKey === 'string' && matchKey === key) {
      hit = true;
    } else if (is.regExp(matchKey) && matchKey.test(key)) {
      hit = true;
    }
  }
  if (!hit) {
    if (is.symbol(value) || is.regExp(value)) return value.toString();
    if (is.primitive(value)) return value;
    if (is.array(value)) return value;
  }

  // only convert recursively when it's a plain object,
  // o = {}
  if (Object.getPrototypeOf(value) === Object.prototype) {
    return convertObject(value, ignore);
  }

  // support class
  const name = value.name || 'anonymous';
  if (is.class(value)) {
    return `<Class ${name}>`;
  }

  // support generator function
  if (is.function(value)) {
    return is.generatorFunction(value) ? `<GeneratorFunction ${name}>` : `<Function ${name}>`;
  }

  const typeName = value.constructor.name;
  if (typeName) {
    if (is.buffer(value) || is.string(value)) return `<${typeName} len: ${value.length}>`;
    return `<${typeName}>`;
  }

  /* istanbul ignore next */
  return util.format(value);
}
