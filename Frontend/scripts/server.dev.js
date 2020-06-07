'use strict';

const _ = require('lodash');
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const errorMiddleware = require('../src/server/middleware/error')

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appIndexJs])) {
  process.exit(1);
}

function extractBundles(stats) {
  // Stats has modules, single bundle
  if (stats.modules) return [stats];

  // Stats has children, multiple bundles
  if (stats.children && stats.children.length) return stats.children;

  // Not sure, assume single
  return [stats];
}

module.exports = function(port, host) {
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const appName = require(paths.appPackageJson).name;
  const urls = prepareUrls(protocol, host, port);

  // Create a webpack compiler that is configured with custom messages.
  const compiler = createCompiler(webpack, config, appName, urls, useYarn);
  // Load proxy config
  const proxySetting = require(paths.appPackageJson).proxy;
  const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
  // Serve webpack assets generated by the compiler over a web sever.
  const serverConfig = createDevServerConfig(
    proxyConfig,
    urls.lanUrlForConfig
  );

  serverConfig.after = app => {
    app.use(webpackHotServerMiddleware(compiler, {
      createHandler: (error, serverRenderer) => (req, res, next) => {
        if (error ||
            // if the dev server doesn't handle a hot-update request, we don't want to pass it through
            // to the SSR server
            req.url.indexOf('hot-update') >= 0) {
          return next(error);
        }
        serverRenderer(req, res, next);
      }
    }))
    app.use(errorMiddleware)
  };

  const devServer = new WebpackDevServer(compiler, serverConfig);

  // MultiStats concatenates the client and server hashes, so when the
  // WebpackDevServer sends the hash to the client for hot reloading,
  // webpackHotDevClient (in react-dev-utils) triggers a full page reload
  // because there is no hot update chunk with that hash.
  // Therefore to make hot reloading work, we'll need to send the hash
  // of the changed bundle only.
  // That will trigger a full reload when the server bundle changes
  // (which seems appropriate) because there won't be a matching hot
  // update chunk for the entire server bundle.
  const _sendStats = devServer._sendStats;
  let prevHashes
  devServer._sendStats = function(sockets, stats, force) {
    const bundles = extractBundles(stats);
    let changed;
    for (let i = 0; i < bundles.length; ++i) {
      const bundle = bundles[i];
      if (!prevHashes || prevHashes[i] !== bundle.hash) {
        changed = bundle;
        break;
      }
    }
    _sendStats.call(this, sockets, changed || bundles[0], force);
    prevHashes = bundles.map(stats => stats.hash);
  };

  compiler.plugin('done', _.once(() => {
    devServer.listen(port, host, err => {
      if (err) {
        return console.log(err);
      }
      openBrowser(urls.localUrlForBrowser);
    });
  }));

  if (isInteractive) {
    clearConsole();
  }
  console.log(chalk.cyan('Starting the development server...\n'));

  return devServer;
};