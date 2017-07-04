require('dotenv').config();
const readline = require('readline');
const YoutubeApi = require('../lib/youtube_api');
const api = new YoutubeApi();

(async () => {
    const res = await authorize();
    console.log(res);

    const info = await api.requestInfo(res.access_token);
    console.log('Access token info:');
    console.log(info);

    console.log(`Please set "${res.refresh_token}" to YOUTUBE_REFRESH_TOKEN on .env`);
})()
    .then(res => console.log(res))
    .catch(e => console.error(e));

async function authorize () {
    console.log('Authorize this app by visiting this url: ', api.authUrl);
    const code = await question('Enter the code from that page here: ');
    const res = await api.requestAccessToken(code);
    return JSON.parse(res);
}

async function question (text) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(text, res => {
            rl.close();
            resolve(res);
        });
    });
}
