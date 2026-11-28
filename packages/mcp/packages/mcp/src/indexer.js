import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolves the Design Atlas monorepo root directory.
 * Checks explicit overrides first, then walks upward from this module.
 *
 * @param {string} [explicitRoot] - Optional explicit root path.
 * @returns {string} Absolute path to the Design Atlas repository root.
 */
export function resolveAtlasRoot(explicitRoot) {
  if (explicitRoot) {
    return resolve(explicitRoot);
  }
  if (process.env.ATLAS_ROOT) {
    return resolve(process.env.ATLAS_ROOT);
  }

  let current = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i += 1) {
    if (
      existsSync(join(current, 'pnpm-workspace.yaml')) ||
      (existsSync(join(current, 'packages')) && existsSync(join(current, 'apps')))
    ) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return resolve(process.cwd());
}

/**
 * Recursively collects files matching a predicate inside a directory.
 *
 * @param {string} dir - Directory to walk.
 * @param {(filePath: string) => boolean} predicate - Filter predicate.
 * @returns {string[]} Matching absolute file paths.
 */
function walkFiles(dir, predicate) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Flattens W3C/Figma-style design tokens JSON into searchable token records.
 *
 * @param {Record<string, unknown>} node - Current JSON object.
 * @param {string[]} pathParts - Accumulated token path segments.
 * @param {Array<object>} out - Output accumulator array.
 */
function flattenTokens(node, pathParts, out) {
  if (!node || typeof node !== 'object') return;

  if ('$value' in node) {
    const tokenPath = pathParts.join('.');
    const cssVarGuess = `--${pathParts.slice(1).join('-').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()}`;
    out.push({
      path: tokenPath,
      group: pathParts[0] || 'core',
      category: pathParts[1] || 'general',
      name: pathParts[pathParts.length - 1] || tokenPath,
      type: String(node.$type || 'unknown'),
      value: node.$value,
      description: node.$description ? String(node.$description) : '',
      cssVarHint: cssVarGuess
    });
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      flattenTokens(value, [...pathParts, key], out);
    }
  }
}

/**
 * Parses CSS custom properties (--var: value;) from CSS source files.
 *
 * @param {string} cssContent - Raw CSS file content.
 * @param {string} sourcePath - Relative source file path.
 * @returns {Array<object>} Extracted CSS variable entries.
 */
function extractCssVariables(cssContent, sourcePath) {
  const vars = [];
  const regex = /(--[a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(cssContent)) !== null) {
    vars.push({
      name: match[1].trim(),
      value: match[2].trim(),
      source: sourcePath
    });
  }
  return vars;
}

/**
 * Extracts component metadata and props from Svelte or React source files.
 *
 * @param {string} content - Component source code.
 * @param {'svelte'|'react'} framework - Target framework.
 * @param {string} filePath - Relative file path.
 * @returns {object} Component metadata record.
 */
function parseComponentSource(content, framework, filePath) {
  const fileName = basename(filePath, extname(filePath));
  const props = [];

  if (framework === 'svelte') {
    const propRegex = /export\s+let\s+([a-zA-Z0-9_]+)(?:\s*=\s*([^;]+))?;/g;
    let match;
    while ((match = propRegex.exec(content)) !== null) {
      props.push({
        name: match[1],
        defaultValue: match[2] ? match[2].trim() : undefined
      });
    }
  } else if (framework === 'react') {
    const interfaceMatch = content.match(/export\s+interface\s+\w+Props\s*\{([\s\S]*?)\}/);
    if (interfaceMatch) {
      const lines = interfaceMatch[1].split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//')) continue;
        const propMatch = trimmed.match(/^([a-zA-Z0-9_]+)(\?)?:\s*([^;]+);?/);
        if (propMatch) {
          props.push({
            name: propMatch[1],
            optional: Boolean(propMatch[2]),
            type: propMatch[3].trim()
          });
        }
      }
    }
  }

  const cssVarsUsed = Array.from(new Set(content.match(/--[a-zA-Z0-9-_]+/g) || []));
  const canonicalName = fileName.replace(/^Atl/, '');
  const atlName = `Atl${canonicalName}`;
  const kebabName = canonicalName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

  return {
    name: fileName,
    componentName: atlName,
    canonicalName,
    cssClass: `.atl-${kebabName}`,
    webComponentTag: `atl-${kebabName}`,
    framework,
    path: filePath,
    props,
    cssVarsUsed,
    lineCount: content.split('\n').length,
    source: content
  };
}

/**
 * Builds an in-memory searchable index of the Design Atlas monorepo.
 *
 * @param {string} [explicitRoot] - Optional explicit monorepo root.
 * @returns {object} Indexed docs, components, tokens, CSS variables, and inventory.
 */
export function buildAtlasIndex(explicitRoot) {
  const root = resolveAtlasRoot(explicitRoot);

  // 1. Index design tokens (JSON + CSS custom properties)
  const tokens = [];
  const tokensJsonPath = join(root, 'packages/tokens/tokens.json');
  if (existsSync(tokensJsonPath)) {
    const raw = JSON.parse(readFileSync(tokensJsonPath, 'utf8'));
    flattenTokens(raw, [], tokens);
  }

  const cssVariables = [];
  const cssTokenFiles = [
    'packages/tokens/src/variables.css',
    'packages/tokens/src/theme.css',
    'packages/css/src/_variables.css',
    'packages/css/src/theme.css'
  ];
  for (const relPath of cssTokenFiles) {
    const absPath = join(root, relPath);
    if (existsSync(absPath)) {
      cssVariables.push(...extractCssVariables(readFileSync(absPath, 'utf8'), relPath));
    }
  }

  // 2. Index markdown documentation
  const docFiles = [
    ...walkFiles(join(root, 'apps/docs'), (f) => f.endsWith('.md')),
    ...walkFiles(join(root, 'docs'), (f) => f.endsWith('.md'))
  ];
  if (existsSync(join(root, 'README.md'))) {
    docFiles.push(join(root, 'README.md'));
  }

  const docs = docFiles.map((absPath) => {
    const relPath = relative(root, absPath).replace(/\\/g, '/');
    const content = readFileSync(absPath, 'utf8');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : basename(relPath, '.md');
    const category = relPath.includes('/components/')
      ? 'components'
      : relPath.includes('/design-tokens/')
        ? 'design-tokens'
        : relPath.includes('/style-guide/')
          ? 'style-guide'
          : relPath.includes('/adrs/')
            ? 'adrs'
            : 'general';

    return {
      title,
      category,
      path: relPath,
      content
    };
  });

  // 3. Index Svelte & React components + CSS utilities
  const svelteFiles = walkFiles(join(root, 'packages/svelte/src'), (f) => f.endsWith('.svelte'));
  const reactFiles = walkFiles(join(root, 'packages/react/src'), (f) =>
    (f.endsWith('.tsx') || f.endsWith('.ts')) && !f.endsWith('index.ts')
  );
  const cssFiles = walkFiles(join(root, 'packages/css/src'), (f) => f.endsWith('.css'));

  const components = [
    ...svelteFiles.map((absPath) =>
      parseComponentSource(readFileSync(absPath, 'utf8'), 'svelte', relative(root, absPath).replace(/\\/g, '/'))
    ),
    ...reactFiles.map((absPath) =>
      parseComponentSource(readFileSync(absPath, 'utf8'), 'react', relative(root, absPath).replace(/\\/g, '/'))
    )
  ];

  const cssAssets = cssFiles.map((absPath) => {
    const relPath = relative(root, absPath).replace(/\\/g, '/');
    return {
      name: basename(relPath),
      path: relPath,
      content: readFileSync(absPath, 'utf8')
    };
  });

  // 4. Build cross-framework parity inventory
  const inventoryMap = new Map();
  for (const comp of components) {
    const key = comp.canonicalName.toLowerCase();
    if (!inventoryMap.has(key)) {
      inventoryMap.set(key, {
        name: comp.componentName,
        canonicalName: comp.canonicalName,
        cssClass: comp.cssClass,
        webComponentTag: comp.webComponentTag,
        svelte: null,
        react: null,
        docs: null
      });
    }
    const entry = inventoryMap.get(key);
    entry[comp.framework] = {
      componentName: comp.name,
      path: comp.path,
      propsCount: comp.props.length,
      usesAtlasTokens: comp.cssVarsUsed.length > 0
    };
  }

  for (const doc of docs) {
    if (doc.category === 'components' && doc.path.includes('/demos/')) {
      const slug = basename(doc.path, '.md').replace(/-/g, '').toLowerCase();
      for (const [key, entry] of inventoryMap.entries()) {
        if (key === slug || slug.includes(key) || key.includes(slug)) {
          entry.docs = doc.path;
        }
      }
    }
  }

  const inventory = Array.from(inventoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return {
    root,
    tokens,
    cssVariables,
    docs,
    components,
    cssAssets,
    inventory
  };
}
