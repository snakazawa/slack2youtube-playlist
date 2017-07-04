const rq = require('request-promise');
const fs = require('fs');
const path = require('path');

const DEFAULT_TOKEN_PATH = path.join(__dirname, '..', 'token.json');
const DEFAULT_REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

class YoutubeAPI {
    constructor (tokenPath = DEFAULT_TOKEN_PATH) {
        this.playlistId = process.env.YOUTUBE_PLAYLIST_ID;
        this.tokenPath = tokenPath;
        this.redirectUri = DEFAULT_REDIRECT_URI;
        this.clientId = process.env.YOUTUBE_OAUTH_CLIENT;
        this.clientSecret = process.env.YOUTUBE_OAUTH_SECRET;
        this.scope = 'https://www.googleapis.com/auth/youtube';
        this.refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
        this.token = null;
    }

    async insertPlaylistItem (videoId) {
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
                Authorization: 'Bearer ' + this.token
            },
            json: true
        });
    }

    get authUrl () {
        const authUrlBase = 'https://accounts.google.com/o/oauth2/v2/auth';
        const params = {
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            access_type: 'offline'
        };
        const paramsStr = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
        return authUrlBase + '?' + paramsStr;
    }

    async refresh () {
        const res = await this.requestRefreshToken(this.refreshToken);
        const content = JSON.parse(res);
        this.token = content.access_token;
    }

    async requestAccessToken (authCode) {
        return rq({
            method: 'POST',
            uri: 'https://www.googleapis.com/oauth2/v4/token',
            form: {
                code: authCode,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'authorization_code',
                access_type: 'offline'
            }
        });
    }

    async requestRefreshToken (refreshToken) {
        return rq({
            method: 'POST',
            uri: 'https://www.googleapis.com/oauth2/v4/token',
            form: {
                refresh_token: refreshToken,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'refresh_token'
            }
        });
    }

    async requestInfo (token) {
        return rq.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token);
    }
}

module.exports = YoutubeAPI;
