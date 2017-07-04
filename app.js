const Koa = require('koa');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const Router = require('koa-router');
const YoutubeApi = require('./lib/youtube_api');

const app = new Koa();

app.use(bodyparser());
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

const youtubeUrlRegex = /https:\/\/www.youtube.com\/watch\?v=(.+?)[&>|]/m;

router.post('/api/slack/chat', async ctx => {
    const {text} = ctx.request.body;
    const videoIds = text.split('\n')
        .map(x => x.match(youtubeUrlRegex))
        .filter(x => x)
        .map(x => x[1]);

    if (!videoIds.length) { return; }

    await youtubeApi.refresh();
    for (let id of videoIds) {
        await youtubeApi.insertPlaylistItem(id);
    }

    ctx.body = {
        text: 'insert ' + videoIds.join(', ') + 'videos to playlist.'
    };
});

app
    .use(router.routes())
    .use(router.allowedMethods());


module.exports = app;
