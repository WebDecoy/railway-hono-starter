# Hono on Railway with WebDecoy

A Hono app for [Railway](https://railway.com) with [WebDecoy](https://webdecoy.com) bot detection on every route. Deploy it as a starting point, or copy what `server.js` does into your own app.

<!-- DEPLOY_BUTTON -->

## What you get

- `@webdecoy/hono` on Node (`@hono/node-server`) in **monitor** mode: automated requests are recorded in your WebDecoy dashboard and every request is still served. The verdict is on `c.get('webdecoy')`.
- A hidden honeytoken link injected into HTML responses. Scrapers that follow it identify themselves; people never see it.
- The real visitor IP. Railway's proxy sends `X-Forwarded-For: <client>, <edge>`, so the middleware trusts two hops (`trustProxy: 2`). Trusting one would make every visitor look like Railway's edge.
- A `/health` route for Railway's healthcheck, never analyzed.

## Deploy

1. Create a free account at [app.webdecoy.com](https://app.webdecoy.com) and add your site.
2. Create an API key under **Settings > API Keys**.
3. Deploy the template and paste the key into `WEBDECOY_API_KEY` when Railway asks. The key is a secret: keep it in Railway's variables, never in a file you commit.

Without a key the app still runs, with local rules only, and nothing reports.

## Prove it reports

Request any page with the reserved test user agent:

```bash
curl -A "WebDecoy-Test/1.0" https://YOUR-APP.up.railway.app/
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
