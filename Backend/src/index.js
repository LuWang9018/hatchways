'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const koaBody = require('koa-body');

const apis = require('./api/api');
const staticCache = require('koa-static-cache');
const path = require('path');
const http = require('http');

const PORT = 3060;
const app = new Koa();
const router = new Router();

app.use(logger());

app.use(
  koaBody({
    multipart: true,
    formLimit: '500mb',
    jsonLimit: '500mb',
    formidable: {
      maxFileSize: 500 * 1024 * 1024,
    },
  })
);

apis.api(router);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
    ctx.stalus = 500;
  }
});

app.use(router.routes());

const __TEST__ = process.env.NODE_ENV === 'test';
const server = __TEST__
  ? http.createServer(app.callback())
  : app.listen(PORT).on('error', err => {
      console.log(PORT);
      console.error(err);
    });
if (!__TEST__) {
  console.log('users api server listening', { port: PORT });
}

module.exports = server;
