import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { seedCards } from '../src/data/projects.js';

const routes = [
  ['/', 'Drift — Project planner', 'Board and list planning with drag, keyboard moves, activity, filters, and JSON export.'],
  ['/planner', 'Planner — Drift', 'Board and list views powered by shared card state.'],
  ...seedCards.map((card) => [`/cards/${card.id}`, `${card.title} — Drift`, card.detail]),
  ['/activity', 'Activity — Drift', 'Local activity trail for project moves and edits.'],
  ['/build', 'How Drift is built', 'Implementation notes for agents learning What Framework.'],
];

const shellPath = join('dist', 'index.html');
if (!existsSync(shellPath)) {
  throw new Error('dist/index.html missing; run vite build first');
}
const shell = readFileSync(shellPath, 'utf8');

function writeRoute(path, title, description) {
  const out = path === '/' ? shellPath : join('dist', path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  const html = shell
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace('<div id="app"></div>', `<div id="app"><noscript><main><h1>${title}</h1><p>${description}</p></main></noscript></div>`);
  writeFileSync(out, html);
}

for (const route of routes) writeRoute(...route);
writeRoute('/404', 'Page not found — Drift', 'Drift includes a genuine 404 artifact for Vura static hosting.');
copyFileSync(join('dist', '404', 'index.html'), join('dist', '404.html'));

console.log(`static aliases OK: ${routes.length} routes plus 404`);
