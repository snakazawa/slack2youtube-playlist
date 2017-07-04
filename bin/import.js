require('dotenv').config();
const Api = require('./lib/youtube_api');

const api = new Api();
const fs = require('fs');

const messages = JSON.parse(fs.readFileSync(process.env.IMPORT_FILE));
messages.reverse();
const texts = messages.map(x => x.text).filter(x => x);

const youtubeUrlRegex = /https:\/\/www.youtube.com\/watch\?v=(.+?)[&>|]/m;

const videoIds = texts
    .map(x => x.match(youtubeUrlRegex))
    .filter(x => x)
    .map(x => x[1]);

(async () => {
    await api.refresh();

    for (let id of videoIds) {
        process.stdout.write(`insert ${id}...`);
        await api.insertPlaylistItem(id);
        console.log('ok');
        await sleep(500);
    }
})().catch(e => console.error(e));


function sleep (ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
