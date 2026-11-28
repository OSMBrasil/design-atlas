#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, '..');
const mod = await import(pathToFileURL(join(pkgRoot, 'dist', 'index.js')).href);

const cards = Object.values(mod.icons)
  .map(
    (icon) =>
      `<div class="card">${mod.renderIcon(icon, { size: '24px' })}<span>${icon.name}${icon.rtlMirror ? ' (RTL)' : ''}</span></div>`
  )
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>@design-atlas/ms-icons Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 24px; display: grid; gap: 32px; }
    section { padding: 24px; border-radius: 12px; border: 1px solid #ccc; }
    .light { background: #ffffff; color: #243045; }
    .dark { background: #141415; color: #e8e9ea; border-color: #333; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; margin-top: 16px; }
    .card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; border: 1px solid currentColor; border-color: color-mix(in srgb, currentColor 20%, transparent); }
    .card span { font-size: 12px; }
  </style>
</head>
<body>
  <section class="light">
    <h2>Light Mode (24px)</h2>
    <div class="grid">${cards}</div>
  </section>
  <section class="dark">
    <h2>Dark Mode (24px)</h2>
    <div class="grid">${cards}</div>
  </section>
</body>
</html>
`;

const outPath = join(pkgRoot, 'preview.html');
writeFileSync(outPath, html);
console.log(`✅ Preview generated at ${outPath}`);
