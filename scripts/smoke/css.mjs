#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const cssDistDir = join(root, 'packages/css/dist');
const svelteLibDir = join(root, 'packages/svelte/src/lib');

console.log('🧪 Running CSS smoke test...');

// 1. Verify dist/index.css has no @import and has expected order
const indexCss = readFileSync(join(cssDistDir, 'index.css'), 'utf8');
for (const file of ['index.css', 'tokens.css', 'reset.css', 'base.css', 'utilities.css']) {
  const content = readFileSync(join(cssDistDir, file), 'utf8');
  if (/@import\b/i.test(content)) {
    console.error(`❌ ${file} contains @import`);
    process.exit(1);
  }
}

const sections = [
  'Primitive Tokens',
  'Semantic Theme Tokens',
  '/* Reset */',
  '/* Base Typography',
  '/* Utility classes */',
];
let lastIdx = -1;
for (const marker of sections) {
  const idx = indexCss.indexOf(marker);
  if (idx <= lastIdx) {
    console.error(`❌ Section "${marker}" missing or out of order in dist/index.css`);
    process.exit(1);
  }
  lastIdx = idx;
}

// 2. Verify reset.css contains ONLY the approved `* { margin: 0; }` rule
const resetCss = readFileSync(join(cssDistDir, 'reset.css'), 'utf8');
const strippedReset = resetCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, '');
if (strippedReset !== '*{margin:0;}' && strippedReset !== '*{margin:0}') {
  console.error(`❌ reset.css contains unexpected rules: ${strippedReset}`);
  process.exit(1);
}

// 3. Verify every var(--x) without fallback in Svelte components is defined
const globalDefined = new Set(
  [...indexCss.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map((m) => m[1])
);

const missing = [];
for (const file of readdirSync(svelteLibDir).filter((f) => f.endsWith('.svelte'))) {
  const content = readFileSync(join(svelteLibDir, file), 'utf8');
  const localDefined = new Set(
    [...content.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map((m) => m[1])
  );

  for (const match of content.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(?:,\s*([^)]+))?\)/g)) {
    const varName = match[1];
    const hasFallback = Boolean(match[2] && match[2].trim().length > 0);
    if (!hasFallback && !globalDefined.has(varName) && !localDefined.has(varName)) {
      missing.push(`${file}: ${varName}`);
    }
  }
}

if (missing.length > 0) {
  console.error('❌ Undefined CSS variables without fallback in Svelte components:');
  for (const item of missing) console.error(`   - ${item}`);
  process.exit(1);
}

console.log('✅ CSS smoke ok');
