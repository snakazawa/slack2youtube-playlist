const Koa = require('koa');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const Router = require('koa-router');

const app = new Koa();

app.use(bodyparser({enableTypes: ['json']}));
app.use(json());
app.use(logger());

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

const router = new Router();
router.get('/', ctx => {
    ctx.body = 'Hello Koa 2!';
});

app
    .use(router.routes())
    .use(router.allowedMethods());


module.exports = app;
