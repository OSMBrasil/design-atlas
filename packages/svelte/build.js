import { readdirSync, copyFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// Ensure dist directory exists
const distDir = "./dist";
mkdirSync(distDir, { recursive: true });

// Copy all .svelte files to dist
const svelteFiles = readdirSync("./src/lib").filter((file) =>
  file.endsWith(".svelte")
);
svelteFiles.forEach((file) => {
  copyFileSync(join("./src/lib", file), join(distDir, file));
});

// Copy i18n helper module
if (existsSync("./src/lib/i18n")) {
  mkdirSync(join(distDir, "i18n"), { recursive: true });
  for (const file of readdirSync("./src/lib/i18n")) {
    copyFileSync(join("./src/lib/i18n", file), join(distDir, "i18n", file));
  }
}

// Generate index.js that exports all components and i18n helpers
let indexContent = "";
svelteFiles.forEach((file) => {
  const componentName = file.replace(".svelte", "");
  indexContent += `export { default as ${componentName} } from './${file}';\n`;
});
indexContent += `export { ATL_LOCALE_CONTEXT_KEY, defaultMessagesEn, exampleMessagesPtBr, mergeMessages, getAtlLocale } from './i18n/messages.js';\n`;

writeFileSync("./dist/index.js", indexContent);

// Generate index.d.ts
let typesContent = "";
svelteFiles.forEach((file) => {
  const componentName = file.replace(".svelte", "");
  typesContent += `declare const ${componentName}: any;\nexport { ${componentName} };\n`;
});
typesContent += `export declare const ATL_LOCALE_CONTEXT_KEY: symbol;\n`;
typesContent += `export declare const defaultMessagesEn: Record<string, any>;\n`;
typesContent += `export declare const exampleMessagesPtBr: Record<string, any>;\n`;
typesContent += `export declare function mergeMessages(overrides?: Record<string, any>): Record<string, any>;\n`;
typesContent += `export declare function getAtlLocale(): { locale: string; dir: 'ltr' | 'rtl'; messages: Record<string, any> };\n`;

writeFileSync("./dist/index.d.ts", typesContent);

console.log("✅ Svelte package built successfully!");
console.log("📁 Generated files in ./dist/");
console.log(`📦 Built ${svelteFiles.length} Svelte components`);
