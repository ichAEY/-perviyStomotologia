import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import demo from '../public/site-data.js';
import { normalizePhone, validateRequest } from '../public/validation.js';
import { validateConfig } from '../server/config.js';
import { createStore } from '../server/store.js';
import { createOfficeServer } from '../server/app.js';
import { deliverPending } from '../server/notifications.js';

// Синтетические данные используются только в тестах.
function liveData() {
  const data = structuredClone(demo);
  data.mode = 'live';
  for (const key of ['legalName','inn','ogrn','licenseNumber','address','hours','entrance']) data.clinic[key] = 'Тестовые данные';
  data.clinic.phone = '+7 999 000-00-00';
  data.clinic.heroImage = './assets/real-clinic-test.jpg';
  data.clinic.clinicImage = './assets/real-clinic-test.jpg';
  data.clinic.serviceImage = '';
  data.consentVersion = 'test-v1';
  data.services.forEach(service => service.items.forEach(item => item.price = 100));
  data.doctors.forEach(doctor => {
    for (const key of ['name','photo','education','qualification','accreditation','schedule']) doctor[key] = 'Тестовые данные';
    doctor.demo = false;
  });
  data.documents.forEach(doc => doc.text = 'Тестовый документ');
  return data;
}
const payload = () => ({ requestId: randomUUID(), phone: '+7 (999) 000-00-00', name: '', consent: true, consentVersion: 'test-v1', website: '' });
async function fixture(t, { mode = 'live', rateLimit = 10, store: providedStore, publicDir = resolve('public') } = {}) {
  const store = providedStore || createStore(':memory:');
  const data = mode === 'live' ? liveData() : demo;
  const server = createOfficeServer({ data, store, publicDir, publicOrigin: 'https://clinic.example', rateLimit });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => { await new Promise(resolve => server.close(resolve)); if (!providedStore) store.close(); });
  const post = (body, origin = 'https://clinic.example') => fetch(`${base}/api/requests`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
  return { store, base, post };
}

test('Russian telephone supports pasted formats and rejects incomplete / nonnumeric values', () => {
  for (const value of ['+7 (999) 000-00-00', '8 999 000 00 00', '9990000000']) assert.equal(normalizePhone(value), '+79990000000');
  for (const value of ['', '123', '+1 555 000 00 00', 'номер 9990000000']) assert.equal(normalizePhone(value), null);
  assert.equal(validateRequest({ phone:'9990000000', name:'', consent:true }).valid, true);
  assert.equal(validateRequest({ phone:'9990000000', consent:false }).valid, false);
});
test('live configuration cannot start with unfilled demo data', () => {
  assert.equal(validateConfig(demo).length, 0);
  assert.ok(validateConfig({ ...demo, mode:'live' }).length > 10);
  assert.equal(validateConfig(liveData()).length, 0);
  for (const key of ['heroImage', 'clinicImage', 'serviceImage']) {
    const input = liveData();
    input.clinic[key] = './assets/clinician-editorial.webp';
    assert.ok(validateConfig(input).some(error => error.includes('Замените иллюстрацию')));
  }
});
test('request is persisted before success; repeating the same request creates one record', async t => {
  const { post, store } = await fixture(t);
  const input = payload();
  const first = await post(input);
  assert.equal(first.status, 201);
  assert.equal((await first.json()).accepted, true);
  assert.equal(store.existing(input.requestId).phone, '+79990000000');
  const repeat = await post(input);
  assert.equal(repeat.status, 200);
  assert.equal(store.count(), 1);
  const conflict = await post({ ...input, name:'Другие тестовые данные' });
  assert.equal(conflict.status, 409);
  assert.equal(store.count(), 1);
});
test('missing consent, old consent, invalid phone, and foreign origin are rejected without persistence', async t => {
  const { post, store } = await fixture(t);
  assert.equal((await post({ ...payload(), consent:false })).status, 422);
  assert.equal((await post({ ...payload(), consentVersion:'old' })).status, 409);
  assert.equal((await post({ ...payload(), phone:'123' })).status, 422);
  assert.equal((await post(payload(), 'https://foreign.example')).status, 403);
  assert.equal(store.count(), 0);
});
test('double concurrent submit is idempotent', async t => {
  const { post, store } = await fixture(t);
  const input = payload();
  const responses = await Promise.all([post(input), post(input)]);
  assert.deepEqual(responses.map(x => x.status).sort(), [200, 201]);
  assert.equal(store.count(), 1);
});
test('rate limiting does not block retry of an already accepted request', async t => {
  const { post, store } = await fixture(t, { rateLimit:1 });
  const input = payload();
  assert.equal((await post(input)).status, 201);
  assert.equal((await post(payload())).status, 429);
  assert.equal((await post(input)).status, 200);
  assert.equal(store.count(), 1);
});
test('demo API never claims receipt or stores personal data', async t => {
  const { post, store } = await fixture(t, { mode:'demo' });
  const response = await post(payload());
  assert.equal(response.status, 409);
  assert.equal((await response.json()).accepted, false);
  assert.equal(store.count(), 0);
});
test('oversized payload and honeypot are rejected', async t => {
  const { post, store } = await fixture(t);
  assert.equal((await post({ ...payload(), website:'robot' })).status, 400);
  assert.equal((await post({ ...payload(), name:'я'.repeat(5000) })).status, 413);
  assert.equal(store.count(), 0);
});
test('failed notification remains queued; next attempt delivers once with request ID', async () => {
  const store = createStore(':memory:');
  try {
    const input = { ...payload(), phone:'+79990000000' };
    store.accept(input, 1000);
    await deliverPending(store, { url:'https://notifications.example', now:1000, fetcher:async () => ({ ok:false }) });
    const row = store.existing(input.requestId);
    assert.equal(row.delivery_state, 'pending');
    assert.equal(row.attempts, 1);
    assert.equal(store.pending(1001).length, 0);
    let calls = 0;
    await deliverPending(store, { url:'https://notifications.example', now:31001, fetcher:async (url, options) => {
      calls++;
      assert.equal(options.headers['Idempotency-Key'], input.requestId);
      assert.equal(JSON.parse(options.body).phone, '+79990000000');
      return { ok:true };
    }});
    assert.equal(calls, 1);
    assert.equal(store.existing(input.requestId).delivery_state, 'delivered');
    assert.equal(store.pending(999999).length, 0);
  } finally { store.close(); }
});
test('SQLite survives process reopen; retention removes expired records', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'tanem-dentistry-'));
  t.after(() => rm(dir, { recursive:true, force:true }));
  const path = join(dir, 'requests.sqlite');
  let store = createStore(path);
  const input = { ...payload(), phone:'+79990000000' };
  store.accept(input, 1);
  store.close();
  store = createStore(path);
  assert.equal(store.count(), 1);
  store.purge(30, 31 * 86400_000);
  assert.equal(store.count(), 0);
  store.close();
});
test('static server protects private files and returns security headers', async t => {
  const publicDir = await mkdtemp(join(tmpdir(), 'dentistry-static-'));
  t.after(() => rm(publicDir, { recursive: true, force: true }));
  await writeFile(join(publicDir, 'index.html'), '<main id="main">Template</main><script>document.documentElement.classList.add("js")</script>');
  const { base } = await fixture(t, { publicDir });
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.match(page.headers.get('content-security-policy'), /sha256-/);
  assert.doesNotMatch(page.headers.get('content-security-policy'), /unsafe-inline/);
  assert.match(await page.text(), /<main id="main">/);
  assert.equal((await fetch(`${base}/.env`)).status, 404);
  assert.equal((await fetch(`${base}/server/store.js`)).status, 404);
});
