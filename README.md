# Hono on Railway or Render with WebDecoy

A Hono app for [Railway](https://railway.com) or [Render](https://render.com) with [WebDecoy](https://webdecoy.com) bot detection on every route. Deploy it as a starting point, or copy what `server.js` does into your own app.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/hono-webdecoy-bot-detection?referralCode=FUqRrv&utm_medium=integration&utm_source=template&utm_campaign=generic)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/WebDecoy/railway-hono-starter)

## What you get

- `@webdecoy/hono` on Node (`@hono/node-server`) in **monitor** mode: automated requests are recorded in your WebDecoy dashboard and every request is still served. The verdict is on `c.get('webdecoy')`.
- A hidden honeytoken link injected into HTML responses. Scrapers that follow it identify themselves; people never see it.
- The real visitor IP on either platform, set by the middleware's `trustProxy` and chosen by the `RENDER` variable Render sets:
  - **Railway** sends `X-Forwarded-For: <client>, <edge>` and drops anything the client sent: `'railway'` reads the client two entries from the right. Trusting one hop would make every visitor look like Railway's edge.
  - **Render** appends to whatever the client sent (`<anything>, <client>, <cloudflare>, <render>`), so the leftmost value is the client's choice: `'cloudflare'` reads `CF-Connecting-IP`, which Cloudflare sets and refuses to accept from a client.
- A `/health` route for the platform healthcheck, never analyzed.

## Deploy

1. Create a free account at [app.webdecoy.com](https://app.webdecoy.com) and add your site.
2. Create an API key under **Settings > API Keys**.
3. Click **Deploy on Railway** or **Deploy to Render** and paste the key into `WEBDECOY_API_KEY` when asked. The key is a secret: keep it in the platform's variables, never in a file you commit.

Without a key the app still runs, with local rules only, and nothing reports.

## Prove it reports

Request any page with the reserved test user agent:

```bash
curl -A "WebDecoy-Test/1.0" https://YOUR-APP-DOMAIN/
```

A detection labeled **Test** appears on the Detections page within a few seconds. Test detections are excluded from stats and billing.

## Enforce

When you have seen what it would block, set `mode: 'enforce'` in `server.js`. Blocked requests then get a 403 (or a 429 for a rate limit); pass `onBlocked` to answer them your own way. See the [docs](https://docs.webdecoy.com/sdk-plugins/node-sdk/).

## Run locally

```bash
cp .env.example .env   # add your key
npm install
node --env-file=.env server.js
```
