import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import data from '../public/site-data.js';
import { validateConfig } from '../server/config.js';

const root = resolve(import.meta.dirname, '..');
const errors = validateConfig(data);
if (errors.length) throw new Error(errors.join('\n'));
async function walk(directory) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}
for (const directory of ['public', 'server', 'scripts', 'test']) {
  for (const path of await walk(resolve(root, directory))) {
    if (path.endsWith('.js')) execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
  }
}
const html = await readFile(resolve(root, 'public/index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('Повторяющиеся HTML id');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(id)) throw new Error(`Нет якоря #${id}`);
const app = await readFile(resolve(root, 'public/app.js'), 'utf8');
for (const [, id] of app.matchAll(/\$\('([^']+)'\)/g)) if (!ids.includes(id)) throw new Error(`Нет элемента ${id}`);
for (const path of ['assets/clinic-hero.webp', 'assets/clinician-editorial.webp', 'assets/clinic-editorial.webp', 'assets/manrope.ttf', 'assets/Manrope-OFL.txt', 'styles.css', 'app.js', 'site-data.js', 'validation.js']) {
  if (!(await stat(resolve(root, 'public', path))).size) throw new Error(`Пустой ресурс ${path}`);
}
console.log(`Checked JavaScript, configuration, ${ids.length} unique element IDs, anchors and local assets. Mode: ${data.mode}.`);
