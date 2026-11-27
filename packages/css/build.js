import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const distDir = './dist';
mkdirSync(distDir, { recursive: true });

// Resolve @design-atlas/tokens/css (already contains primitives + light-dark theme, no @import)
const tokensCssPath = require.resolve('@design-atlas/tokens/css');
const tokensCss = readFileSync(tokensCssPath, 'utf8');

const resetCss = readFileSync('./src/reset.css', 'utf8');
const baseCss = readFileSync('./src/base.css', 'utf8');
const utilitiesCss = readFileSync('./src/utilities.css', 'utf8');

// Write standalone entrypoints
writeFileSync('./dist/tokens.css', tokensCss);
writeFileSync('./dist/reset.css', resetCss);
writeFileSync('./dist/base.css', baseCss);
writeFileSync('./dist/utilities.css', utilitiesCss);

// Build self-contained index.css in order: tokens + theme -> reset -> base -> utilities
const indexCss = [tokensCss, resetCss, baseCss, utilitiesCss]
  .map((part) => part.trim())
  .join('\n\n') + '\n';

writeFileSync('./dist/index.css', indexCss);

console.log('✅ CSS package built successfully!');
console.log('📁 Generated files in ./dist/');
