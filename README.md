# slack2youtube-playlist

The service inserts music video attached specified slack channel to specified youtube playlist automatically.

## Requirements

- Node.js (\>8.1.3)

## Install

```bash
npm i

cp .env.default .env
edit .env # set YOUTUBE_PLAYLIST_ID, YOUTUBE_OAUTH_CLIENT and YOUTUBE_OAUTH_SECRET

node bin/auth.js # to authorize google api
edit .env # set YOUTUBE_REFRESH_TOKEN

# start
npm run start
```

Slack outgoing 

Please set up [Slack Outgoing Webhooks](https://my.slack.com/services/new/outgoing-webhook).  
The endpoint is `http://<Your domain>/api/slack/chat`.
