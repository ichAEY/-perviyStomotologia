import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import data from '../public/site-data.js';
import { validateConfig } from '../server/config.js';
const root = resolve(import.meta.dirname, '..');
const errors = validateConfig(data);
if (errors.length) throw new Error(errors.join('\n'));
if (!data.services.length || new Set(data.services.map(item => item.id)).size !== data.services.length) throw new Error('Проверьте уникальные идентификаторы услуг.');
if (data.template.facts.length !== 3) throw new Error('Нужны три поля фактов для обеих версий.');
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (path.endsWith('.js')) execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
  }
}
for (const dir of ['public', 'server', 'scripts', 'test']) await walk(resolve(root, dir));
for (const path of [data.clinic.heroImage, data.clinic.clinicImage, data.clinic.serviceImage, ...data.template.ribbonImages, '/assets/favicon.svg']) {
  if (!(await stat(resolve(root, 'public', path.replace(/^\.?\//, '')))).size) throw new Error(`Пустой ресурс ${path}`);
}
for (const path of ['app/desktop-perfect.tsx', 'app/mobile-v2.tsx']) {
  const content = await readFile(resolve(root, path), 'utf8');
  const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`Повторяющиеся id: ${path}`);
  for (const [, id] of content.matchAll(/goTo\('([^']+)'\)/g)) if (!ids.includes(id)) throw new Error(`Нет якоря ${id}: ${path}`);
}
console.log('Checked template configuration, both responsive trees, navigation, JavaScript and all referenced media.');
