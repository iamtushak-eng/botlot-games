// Finds games in this folder and writes games.json for index.html.
// A game = <name>.html (the game) + <name>.png (thumbnail) + <name>.txt (description). Run: node scan.mjs
// Use it as the build command on Cloudflare Pages / Netlify, or let the GitHub Action do it on every push.
import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || path.dirname(new URL(import.meta.url).pathname));
const skip = /^(index|404|403|500|offline)\.html?$/i, by = new Map();
for (const n of fs.readdirSync(dir)) {
  if (n.startsWith('.') || !fs.statSync(path.join(dir, n)).isFile()) continue;
  const stem = n.replace(/\.[^.]+$/, ''), k = stem.toLowerCase(), g = by.get(k) || {};
  if (/\.html?$/i.test(n) && !skip.test(n)) g.html = n;
  else if (/\.(png|jpe?g|webp|avif|gif)$/i.test(n)) { if (!g.png || /\.png$/i.test(n)) g.png = n; }
  else if (/\.txt$/i.test(n)) g.txt = n;
  by.set(k, g);
}
const games = [...by.values()].filter((g) => g.html).sort((a, b) => a.html.localeCompare(b.html));
fs.writeFileSync(path.join(dir, 'games.json'), JSON.stringify(games, null, 2) + '\n');
console.log(`games.json: ${games.length} game(s)`, games.map((g) => g.html).join(', '));
