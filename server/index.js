import data from '../public/site-data.js';
import { createOfficeServer } from './app.js';
import { createStore } from './store.js';
import { deliverPending } from './notifications.js';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const isLive = data.mode === 'live';
const webhookUrl = process.env.REQUEST_WEBHOOK_URL;
if (isLive && (!webhookUrl || !webhookUrl.startsWith('https://'))) throw new Error('Для live нужен HTTPS REQUEST_WEBHOOK_URL клиники.');
const retention = Number(process.env.REQUEST_RETENTION_DAYS || 30);
if (!Number.isInteger(retention) || retention < 1 || retention > 3650) throw new Error('Некорректный REQUEST_RETENTION_DAYS.');
const store = createStore(resolve(process.env.DATA_DIR || 'var', 'requests.sqlite'));
const server = createOfficeServer({
  data, store,
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
  publicOrigin: process.env.PUBLIC_ORIGIN
});
let delivering = false;
const tick = async () => {
  if (delivering || !isLive) return;
  delivering = true;
  try {
    await deliverPending(store, { url: webhookUrl, token: process.env.REQUEST_WEBHOOK_TOKEN });
    store.purge(retention);
  } finally { delivering = false; }
};
const interval = setInterval(tick, 15_000);
interval.unref();
const port = Number(process.env.PORT || 3000);
server.listen(port, process.env.HOST || '127.0.0.1', () => {
  console.log(`TANEM dentistry ready on port ${port}; mode: ${data.mode}`);
  void tick();
});
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => {
  clearInterval(interval);
  server.close(async () => {
    while (delivering) await new Promise(resolve => setTimeout(resolve, 20));
    store.close();
    process.exit(0);
  });
});
