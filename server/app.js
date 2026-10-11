import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { validateRequest } from '../public/validation.js';
import { validateConfig } from './config.js';

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg' };
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
async function readJson(req) {
  let bytes = 0;
  const chunks = [];
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 4096) throw new Error('TOO_LARGE');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export function createOfficeServer({ data, store, publicDir, publicOrigin, rateLimit = 10 }) {
  const configErrors = validateConfig(data);
  if (configErrors.length) throw new Error(configErrors.join('\n'));
  if (data.mode === 'live' && !publicOrigin) throw new Error('Для live нужен PUBLIC_ORIGIN');
  const rate = new Map();
  const server = createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://mc.yandex.ru; style-src 'self'; img-src 'self' https: data:; font-src 'self'; connect-src 'self' https://mc.yandex.ru https://mc.yandex.com; frame-src https://mc.yandex.ru; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return send(res, 400, { message: 'Некорректный адрес.' }); }
    if (pathname === '/api/health' && req.method === 'GET') return send(res, 200, { ok: true, mode: data.mode });
    if (pathname === '/api/requests') {
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { message: 'Используйте POST.' }); }
      if (data.mode !== 'live') return send(res, 409, { accepted: false, message: 'Это образец. Заявки в клинику не отправляются.' });
      if (req.headers.origin !== publicOrigin || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { accepted: false, message: 'Отправляйте заявку с сайта клиники.' });
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, { accepted: false, message: 'Некорректный формат заявки.' });
      let input;
      try { input = await readJson(req); } catch (error) { return send(res, error.message === 'TOO_LARGE' ? 413 : 400, { accepted: false, message: 'Не удалось прочитать заявку.' }); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) return send(res, 400, { accepted: false, message: 'Некорректная заявка.' });
      if (input.website) return send(res, 400, { accepted: false, message: 'Не удалось принять заявку.' });
      const result = validateRequest(input);
      if (!result.valid) return send(res, 422, { accepted: false, message: Object.values(result.errors)[0], errors: result.errors });
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId || '')) return send(res, 422, { accepted: false, message: 'Обновите страницу и повторите отправку.' });
      if (input.consentVersion !== data.consentVersion) return send(res, 409, { accepted: false, message: 'Согласие обновилось. Обновите страницу перед отправкой заявки.' });
      const existing = store.existing(input.requestId);
      const phoneKey = createHash('sha256').update(result.data.phone).digest('hex');
      // Remote socket, not untrusted X-Forwarded-For. Phone limit is separate.
      const keys = [req.socket.remoteAddress || 'unknown', phoneKey];
      const now = Date.now();
      for (const [key, bucket] of rate) if (bucket.until <= now) rate.delete(key);
      if (!existing && keys.some(key => (rate.get(key)?.count || 0) >= rateLimit)) return send(res, 429, { accepted: false, message: 'Слишком много попыток. Повторите позже или позвоните в клинику.' });
      try {
        const status = store.accept({ ...result.data, requestId: input.requestId, consentVersion: input.consentVersion });
        if (status === 'conflict') return send(res, 409, { accepted: false, message: 'Данные этой заявки изменились. Обновите страницу и попробуйте ещё раз.' });
        if (status === 'created') keys.forEach(key => rate.set(key, { count: (rate.get(key)?.count || 0) + 1, until: rate.get(key)?.until || now + 3600_000 }));
        // SQLite записала заявку и очередь уведомления до ответа клиенту.
        return send(res, status === 'created' ? 201 : 200, { accepted: true, id: input.requestId });
      } catch { return send(res, 503, { accepted: false, message: 'Не удалось сохранить заявку. Попробуйте ещё раз или позвоните в клинику.' }); }
    }
    if (!['GET', 'HEAD'].includes(req.method)) return send(res, 405, { message: 'Метод не поддерживается.' });
    if (pathname === '/') pathname = '/index.html';
    const root = resolve(publicDir);
    const file = resolve(root, `.${pathname}`);
    if (!file.startsWith(root + sep) || pathname.split('/').some(part => part.startsWith('.'))) return send(res, 404, { message: 'Страница не найдена.' });
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        // Authorize only the inline scripts actually present in the static HTML.
        'Content-Security-Policy': "default-src 'self'; script-src 'self' " + (extname(file) === '.html' ? [...body.toString().matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => "'sha256-" + createHash('sha256').update(match[1]).digest('base64') + "'").join(' ') : '') + "; style-src 'self'; img-src 'self' https: data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
        'Content-Type': mime[extname(file)] || 'application/octet-stream',
        'Cache-Control': extname(file) === '.html' || extname(file) === '.js' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { send(res, 404, { message: 'Страница не найдена.' }); }
  });
  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  return server;
}
