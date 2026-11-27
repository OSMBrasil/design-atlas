import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const distDir = './dist';
mkdirSync(distDir, { recursive: true });

// Read source files from ./src
const variablesCss = readFileSync('./src/_variables.css', 'utf8');
const themeCss = readFileSync('./src/theme.css', 'utf8');
const utilitiesCss = readFileSync('./src/utilities.css', 'utf8');
const resetCss = readFileSync('./src/reset.css', 'utf8');

// atl-style.css = _variables.css + theme.css + utilities.css
const atlStyleCss = [variablesCss, themeCss, utilitiesCss]
  .map((part) => part.trim())
  .join('\n\n') + '\n';

writeFileSync('./dist/atl-style.css', atlStyleCss);

// atl-reset.css = reset.css
writeFileSync('./dist/atl-reset.css', resetCss);

console.log('✅ CSS package built successfully!');
console.log('📁 Generated files in ./dist/');
