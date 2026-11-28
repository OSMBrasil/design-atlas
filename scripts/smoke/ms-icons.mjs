#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const pkgDir = join(root, 'packages/ms-icons');
const distDir = join(pkgDir, 'dist');
const config = JSON.parse(readFileSync(join(pkgDir, 'icons.config.json'), 'utf8'));

console.log('🧪 Running ms-icons smoke test...');

// 1. Verify icons:check passes (no manual drift)
execSync('pnpm --filter @design-atlas/ms-icons check', { stdio: 'inherit' });

// 2. Collect expected icon IDs
const expectedIds = [];
for (const entry of config.icons) {
  const fills = Array.isArray(entry.fills) && entry.fills.length > 0 ? entry.fills : [0];
  for (const fill of fills) {
    expectedIds.push(fill === 1 ? `${entry.name}-fill` : entry.name);
  }
}

// 3. Validate each individual SVG in dist/svg/
for (const id of expectedIds) {
  const svgPath = join(distDir, 'svg', `${id}.svg`);
  if (!existsSync(svgPath)) {
    console.error(`❌ Missing built SVG: ${svgPath}`);
    process.exit(1);
  }
  const svg = readFileSync(svgPath, 'utf8');
  if (!/viewBox="[^"]+"/i.test(svg)) {
    console.error(`❌ SVG missing viewBox: ${id}.svg`);
    process.exit(1);
  }
  if (/<mask\b|\bid=|\bwidth=|\bheight=/i.test(svg)) {
    console.error(`❌ SVG contains forbidden mask/id/width/height: ${id}.svg`);
    process.exit(1);
  }
  if (/(?:fill|stroke)="(?!currentColor"|none")[^"]*"/i.test(svg)) {
    console.error(`❌ SVG contains hardcoded color instead of currentColor: ${id}.svg`);
    process.exit(1);
  }
}

// 4. Validate sprite.svg contains all icons
const sprite = readFileSync(join(distDir, 'sprite.svg'), 'utf8');
for (const id of expectedIds) {
  if (!sprite.includes(`id="atl-icon-${id}"`)) {
    console.error(`❌ sprite.svg missing symbol atl-icon-${id}`);
    process.exit(1);
  }
}

// 5. Validate ESM exports & renderIcon helper
const mod = await import(pathToFileURL(join(distDir, 'index.js')).href);
if (!mod.icons || typeof mod.renderIcon !== 'function') {
  console.error('❌ ESM bundle missing icons map or renderIcon helper');
  process.exit(1);
}
for (const id of expectedIds) {
  if (!mod.icons[id]) {
    console.error(`❌ icons map missing "${id}"`);
    process.exit(1);
  }
}

const decSvg = mod.renderIcon(mod.info);
if (!decSvg.includes('aria-hidden="true"') || !decSvg.includes('width="1.5rem"')) {
  console.error('❌ renderIcon decorative defaults failed');
  process.exit(1);
}
const infSvg = mod.renderIcon(mod.info, { label: 'Info', size: '24px' });
if (!infSvg.includes('role="img"') || !infSvg.includes('aria-label="Info"')) {
  console.error('❌ renderIcon informative mode failed');
  process.exit(1);
}

// 6. Validate build script does not use network APIs
const buildSrc = readFileSync(join(pkgDir, 'scripts/build.mjs'), 'utf8');
if (/\bfetch\(|https?:\/\//.test(buildSrc.replace(/http:\/\/www\.w3\.org\/2000\/svg/g, ''))) {
  console.error('❌ build.mjs must be offline (no network calls)');
  process.exit(1);
}

console.log(`✅ ms-icons smoke ok (${expectedIds.length} icons verified)`);
