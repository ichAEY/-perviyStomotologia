import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function loadSource(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  runInNewContext(compiled, { module, exports: module.exports, process, require: (name) => {
    assert.ok(name in dependencies, 'Unexpected dependency: ' + name);
    return dependencies[name];
  } });
  return module.exports;
}

const data = loadSource('../app/clinic-data.ts');
const { normalizePhone, consultationMailto } = loadSource('../app/consultation.ts', { './clinic-data': data });

test('Phone accepts formatting and rejects incomplete or excessive numbers', () => {
  assert.equal(normalizePhone('+7 (999) 000-00-00'), '79990000000');
  assert.equal(normalizePhone('123'), '');
  assert.equal(normalizePhone(''), '');
  assert.equal(normalizePhone('1234567890123456'), '');
});

test('Consultation mail preserves the selected dental question and the contact number', () => {
  const href = consultationMailto({ phone: '+7 (999) 000-00-00', name: 'Тест', request: 'Нужно восстановить зуб' });
  assert.ok(href.startsWith('mailto:medikommos@gmail.com?'));
  const params = new URLSearchParams(href.split('?')[1]);
  assert.equal(params.get('subject'), 'Запрос на консультацию — Медиком-М');
  assert.match(params.get('body'), /Нужно восстановить зуб/);
  assert.match(params.get('body'), /\+7 \(999\) 000-00-00/);
  assert.match(params.get('body'), /Имя: Тест/);
  assert.match(params.get('body'), /https:\/\/ichaey\.github\.io\/-perviyStomotologia\//);
});

test('Name is optional and an invalid telephone cannot produce a request', () => {
  const href = consultationMailto({ phone: '+79990000000', name: '', request: 'Консультация стоматолога' });
  assert.doesNotMatch(new URLSearchParams(href.split('?')[1]).get('body'), /Имя:/);
  assert.throws(() => consultationMailto({ phone: '123', name: '', request: 'Консультация стоматолога' }));
});
