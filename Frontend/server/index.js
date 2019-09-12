const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
router.get('*', async ctx => {
  ctx.body = `
     <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8">
         <title>React SSR</title>
       </head>
       <body>
         <div id="app"></div>
         <script type="text/javascript" src="/bundle.js"></script>
       </body>
     </html>
   `;
});

app.use(router.routes());
app.listen(3000, '0.0.0.0');
