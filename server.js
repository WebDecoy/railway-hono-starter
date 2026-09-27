import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { webdecoy } from '@webdecoy/hono';
import { readFile } from 'node:fs/promises';

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

const apiKey = process.env.WEBDECOY_API_KEY;
if (!apiKey) {
  console.warn('WEBDECOY_API_KEY is not set: running local rules only, nothing reports to WebDecoy.');
}

// Railway's healthcheck. Registered before the middleware so it is never analyzed.
app.get('/health', (c) => c.json({ status: 'ok' }));

// Monitor mode (the default) records detections and still serves every request.
// Switch to mode: 'enforce' once you have seen what it would block.
app.use(
  '*',
  webdecoy({
    apiKey,
    // Railway rewrites X-Forwarded-For to exactly "<client>, <edge>" (anything
    // the client sent is dropped). Trusting two hops reports the real visitor
    // rather than Railway's edge.
    trustProxy: 2,
    skipPaths: ['/health'],
  }),
);

const indexHtml = await readFile(new URL('./public/index.html', import.meta.url), 'utf8');
app.get('/', (c) => c.html(indexHtml));

app.get('/api/hello', (c) => {
  const decision = c.get('webdecoy');
  return c.json({
    message: 'Hello from Railway',
    webdecoy: decision
      ? {
          conclusion: decision.conclusion,
          threat_level: decision.detection?.threat_level,
          detection_id: decision.detection?.detection_id,
        }
      : null,
  });
});

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Listening on port ${info.port}`);
});
