const rq = require('request-promise');
const fs = require('fs');
const path = require('path');

const DEFAULT_TOKEN_PATH = path.join(__dirname, '..', 'token.json');

class YoutubeAPI {
    constructor (tokenPath = DEFAULT_TOKEN_PATH) {
        this.playlistId = process.env.YOUTUBE_PLAYLIST_ID;
        this.tokenPath = tokenPath;
    }

    async insertPaylistItem (videoId) {
        const {token} = this.loadToken();
        return rq({
            method: 'POST',
            uri: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
            body: {
                snippet: {
                    playlistId: this.playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: videoId
                    }
                }
            },
            headers: {
                Authorization: 'Bearer ' + token
            },
            json: true
        });
    }

    loadToken () {
        const content = fs.readFileSync(this.tokenPath, 'utf-8');
        return JSON.parse(content);
    }

    saveToken (token, refreshToken) {
        fs.writeFileSync(this.tokenPath, JSON.stringify({token, refreshToken}), 'utf-8')
    }
}

module.exports = YoutubeAPI;
