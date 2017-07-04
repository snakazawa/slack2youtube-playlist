const Koa = require('koa');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const Router = require('koa-router');
const YoutubeApi = require('./lib/youtube_api');

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

// routing
const router = new Router();
const youtubeApi = new YoutubeApi();

router.get('/', ctx => {
    ctx.body = 'Hello Koa 2!';
});

router.get('/api/playlist/item', async ctx => {
    const videoId = ctx.request.query.videoId;
    const res = await youtubeApi.insertPaylistItem(videoId);
    ctx.body = {message: 'success'};
});

app
    .use(router.routes())
    .use(router.allowedMethods());


module.exports = app;
