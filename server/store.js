import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';

export function createStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  if (path !== ':memory:') chmodSync(path, 0o600);
  db.exec(`
    PRAGMA journal_mode=WAL;
    PRAGMA synchronous=FULL;
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL,
      phone TEXT NOT NULL, name TEXT NOT NULL, consent_version TEXT NOT NULL,
      created_at INTEGER NOT NULL, delivery_state TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0, next_attempt INTEGER NOT NULL DEFAULT 0
    );
  `);
  const fingerprint = data => createHash('sha256').update(JSON.stringify([data.phone, data.name, data.consentVersion])).digest('hex');
  return {
    accept(data, now = Date.now()) {
      const hash = fingerprint(data);
      const existing = db.prepare('SELECT fingerprint FROM requests WHERE id = ?').get(data.requestId);
      if (existing) return existing.fingerprint === hash ? 'duplicate' : 'conflict';
      db.prepare('INSERT INTO requests (id,fingerprint,phone,name,consent_version,created_at,next_attempt) VALUES (?,?,?,?,?,?,?)')
        .run(data.requestId, hash, data.phone, data.name, data.consentVersion, now, now);
      return 'created';
    },
    existing(id) { return db.prepare('SELECT * FROM requests WHERE id = ?').get(id); },
    pending(now = Date.now()) { return db.prepare("SELECT * FROM requests WHERE delivery_state = 'pending' AND next_attempt <= ? ORDER BY created_at LIMIT 20").all(now); },
    delivered(id) { db.prepare("UPDATE requests SET delivery_state = 'delivered', attempts = attempts + 1 WHERE id = ?").run(id); },
    retry(id, attempts, now = Date.now()) {
      const delay = Math.min(6 * 60 * 60 * 1000, 30_000 * 2 ** Math.min(attempts, 10));
      db.prepare('UPDATE requests SET attempts = attempts + 1, next_attempt = ? WHERE id = ?').run(now + delay, id);
    },
    purge(days, now = Date.now()) { db.prepare('DELETE FROM requests WHERE created_at < ?').run(now - days * 86400_000); },
    count() { return db.prepare('SELECT count(*) AS n FROM requests').get().n; },
    close() { db.close(); }
  };
}
