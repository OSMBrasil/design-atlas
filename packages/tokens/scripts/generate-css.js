import { readFileSync, writeFileSync, mkdirSync } from 'fs';

// Ensure dist directory exists
const distDir = './dist';
mkdirSync(distDir, { recursive: true });

// Copy tokens.json to dist (unchanged)
const tokensJson = readFileSync('./tokens.json', 'utf8');
writeFileSync('./dist/tokens.json', tokensJson);

// Build dist/tokens.css from working primitive + semantic theme CSS
const variablesCss = readFileSync('./src/variables.css', 'utf8');
const themeCss = readFileSync('./src/theme.css', 'utf8');

const combinedCss = `${variablesCss.trimEnd()}\n\n${themeCss.trimStart()}`;
writeFileSync('./dist/tokens.css', combinedCss);

console.log('✅ Tokens package built successfully!');
console.log('📁 Generated files in ./dist/');
