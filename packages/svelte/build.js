import {
  readdirSync,
  copyFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from "fs";
import { join, relative } from "path";

const srcLibDir = "./src/lib";
const distDir = "./dist";
mkdirSync(distDir, { recursive: true });

/** @type {{ name: string, relPath: string }[]} */
const componentExports = [];

/**
 * Recursively copies files from `srcDir` into `targetDir` and collects
 * all `Atl*.svelte` components for `dist/index.js` and `dist/index.d.ts`.
 */
function copyDirRecursive(srcDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const targetPath = join(targetDir, entry);
    const stats = statSync(srcPath);

    if (stats.isDirectory()) {
      copyDirRecursive(srcPath, targetPath);
    } else if (
      entry.endsWith(".svelte") ||
      entry.endsWith(".js") ||
      entry.endsWith(".ts")
    ) {
      if (srcDir === srcLibDir && entry === "index.js") {
        continue;
      }
      copyFileSync(srcPath, targetPath);
      if (entry.endsWith(".svelte") && entry.startsWith("Atl")) {
        const relPath = relative(srcLibDir, srcPath).replace(/\\/g, "/");
        componentExports.push({
          name: entry.replace(".svelte", ""),
          relPath,
        });
      }
    }
  }
}

if (existsSync(srcLibDir)) {
  copyDirRecursive(srcLibDir, distDir);
}

componentExports.sort((a, b) => a.name.localeCompare(b.name));

// Generate index.js that exports all components and i18n helpers
let indexContent = "";
for (const { name, relPath } of componentExports) {
  indexContent += `export { default as ${name} } from './${relPath}';\n`;
}
indexContent += `export { ATL_LOCALE_CONTEXT_KEY, defaultMessagesEn, exampleMessagesPtBr, mergeMessages, getAtlLocale } from './i18n/messages.js';\n`;

writeFileSync(join(distDir, "index.js"), indexContent);

// Generate index.d.ts
let typesContent = "";
for (const { name } of componentExports) {
  typesContent += `declare const ${name}: any;\nexport { ${name} };\n`;
}
typesContent += `export declare const ATL_LOCALE_CONTEXT_KEY: symbol;\n`;
typesContent += `export declare const defaultMessagesEn: Record<string, any>;\n`;
typesContent += `export declare const exampleMessagesPtBr: Record<string, any>;\n`;
typesContent += `export declare function mergeMessages(overrides?: Record<string, any>): Record<string, any>;\n`;
typesContent += `export declare function getAtlLocale(): { locale: string; dir: 'ltr' | 'rtl'; messages: Record<string, any> };\n`;

writeFileSync(join(distDir, "index.d.ts"), typesContent);

console.log("✅ Svelte package built successfully!");
console.log("📁 Generated files in ./dist/");
console.log(`📦 Built ${componentExports.length} Svelte components`);
