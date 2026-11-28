const VALID_CATEGORIES = ['tokens', 'components', 'accessibility', 'layout', 'css', 'i18n'];

/**
 * Detects framework and language from code content and optional filename.
 *
 * @param {string} code
 * @param {string} [framework]
 * @param {string} [filename]
 * @returns {{ framework: string, language: string }}
 */
function detectContext(code, framework, filename = '') {
  const lowerFile = filename.toLowerCase();
  const detectedFramework =
    framework && framework !== 'auto'
      ? framework
      : lowerFile.endsWith('.svelte') || code.includes('<script') || /\bAtl[A-Z]/.test(code)
        ? 'svelte'
        : lowerFile.endsWith('.tsx') || lowerFile.endsWith('.jsx') || code.includes('React') || code.includes('className=')
          ? 'react'
          : lowerFile.endsWith('.css')
            ? 'css'
            : 'html';

  const language = lowerFile.endsWith('.tsx') || lowerFile.endsWith('.ts')
    ? 'typescript'
    : lowerFile.endsWith('.svelte')
      ? 'svelte'
      : lowerFile.endsWith('.css')
        ? 'css'
        : lowerFile.endsWith('.jsx') || lowerFile.endsWith('.js')
          ? 'javascript'
          : detectedFramework === 'svelte'
            ? 'svelte'
            : detectedFramework === 'react'
              ? 'javascript'
              : 'html';

  return { framework: detectedFramework, language };
}

/**
 * Runs single-file compliance audit in Carbon-inspired compact JSON format.
 *
 * @param {object} params
 * @param {string} params.code - Source code to validate.
 * @param {string} [params.framework='auto'] - Target framework.
 * @param {string} [params.filename=''] - Optional file path for better detection.
 * @param {string[]} [params.categories] - Optional subset of categories to run.
 * @param {boolean} [params.includeContext=false] - Attach Atlas docs/tokens context.
 * @param {object} [params.index] - Optional Atlas index for context enrichment.
 * @returns {object} Compact audit result matching Carbon MCP code_audit conventions.
 */
export function auditAtlasCode({
  code,
  framework = 'auto',
  filename = '',
  categories,
  includeContext = false,
  index = null
}) {
  const startedAt = Date.now();
  const { framework: detectedFramework, language } = detectContext(code, framework, filename);
  const activeCategories = Array.isArray(categories) && categories.length > 0
    ? categories.filter((c) => VALID_CATEGORIES.includes(c))
    : VALID_CATEGORIES;

  const isEnabled = (cat) => activeCategories.includes(cat);
  const issues = [];
  const lines = code.split('\n');
  let nestingDepth = 0;

  const pushIssue = (issue) => {
    if (!isEnabled(issue.cat)) return;
    issues.push(issue);
  };

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    const snippet = trimmed.slice(0, 60);

    // Track CSS nesting depth
    if (trimmed.includes('{')) {
      nestingDepth += (trimmed.match(/\{/g) || []).length;
    }
    if (trimmed.includes('&') && nestingDepth > 3) {
      pushIssue({
        rule: 'atlas-css-nesting-001',
        name: 'Excessive CSS nesting depth',
        sev: 'w',
        cat: 'css',
        msg: `Native CSS nesting depth (${nestingDepth}) exceeds the 3-level limit`,
        fix: 'Flatten selectors to keep specificity low (component -> variant/state -> pseudo-class)',
        line: lineNum,
        col: line.indexOf('&') + 1,
        ctx: snippet
      });
    }
    if (trimmed.includes('}')) {
      nestingDepth = Math.max(0, nestingDepth - (trimmed.match(/\}/g) || []).length);
    }

    // 1. Sass/SCSS syntax ban (Atlas uses native CSS nesting + custom properties)
    const sassMatch = line.match(/(@(?:mixin|include|extend)\b|\$[a-zA-Z0-9_-]+\s*:)/);
    if (sassMatch) {
      pushIssue({
        rule: 'atlas-css-nesting-002',
        name: 'No Sass/SCSS syntax',
        sev: 'e',
        cat: 'css',
        msg: `Sass syntax "${sassMatch[1]}" is not supported in Design Atlas`,
        fix: 'Use native CSS nesting (&) and @design-atlas/tokens CSS custom properties (--var)',
        line: lineNum,
        col: (sassMatch.index || 0) + 1,
        ctx: snippet,
        token: sassMatch[1]
      });
    }

    // 2. Hardcoded hex colors
    const hexMatch = line.match(/#[0-9a-fA-F]{3,8}\b/);
    if (hexMatch && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
      pushIssue({
        rule: 'atlas-token-color-001',
        name: 'No raw hex colors',
        sev: 'w',
        cat: 'tokens',
        msg: `Use an Atlas color token instead of raw hex "${hexMatch[0]}"`,
        fix: 'Replace with a semantic token such as var(--color-base), var(--bgn-accent), or var(--color-error)',
        line: lineNum,
        col: (hexMatch.index || 0) + 1,
        ctx: snippet,
        token: hexMatch[0],
        autoFix: {
          orig: hexMatch[0],
          repl: 'var(--color-base)'
        }
      });
    }

    // 3. Non-Atlas Tailwind color utilities
    const twMatch = line.match(/\b(bg|text|border)-(blue|gray|red|green|slate|zinc|indigo)-\d{2,3}\b/);
    if (twMatch) {
      const replacement = twMatch[1] === 'bg' ? 'bgn-accent' : twMatch[1] === 'text' ? 'color-base' : 'border-color-base';
      pushIssue({
        rule: 'atlas-token-tailwind-001',
        name: 'No Tailwind color utilities',
        sev: 'e',
        cat: 'tokens',
        msg: `Tailwind utility "${twMatch[0]}" bypasses Design Atlas tokens (ADR-03)`,
        fix: `Use @design-atlas/css class ".${replacement}" or @design-atlas/tokens CSS custom properties`,
        line: lineNum,
        col: (twMatch.index || 0) + 1,
        ctx: snippet,
        token: twMatch[0],
        autoFix: {
          orig: twMatch[0],
          repl: replacement
        }
      });
    }

    // 4. External icon packages (Material Symbols required)
    const iconPkgMatch = line.match(/from\s+['"](lucide-react|@heroicons[^'"]*|react-icons[^'"]*|@carbon\/icons-react|@fortawesome[^'"]*)['"]/);
    if (iconPkgMatch) {
      pushIssue({
        rule: 'atlas-comp-icons-001',
        name: 'Use Google Material Symbols',
        sev: 'w',
        cat: 'components',
        msg: `External icon library "${iconPkgMatch[1]}" detected`,
        fix: 'Design Atlas standardizes on Google Material Symbols (see apps/docs/style-guide/icons.md)',
        line: lineNum,
        col: (iconPkgMatch.index || 0) + 1,
        ctx: snippet,
        token: iconPkgMatch[1]
      });
    }

    // 5. Hardcoded pixel values for spacing/typography/radius (no autoFix for typography per Carbon convention)
    const pxMatch = line.match(/(padding|margin|gap|font-size|border-radius)\s*:\s*(\d+px)/);
    if (pxMatch) {
      const isTypography = pxMatch[1] === 'font-size';
      const issue = {
        rule: 'atlas-layout-px-001',
        name: 'Avoid hardcoded pixel values',
        sev: 'i',
        cat: isTypography ? 'tokens' : 'layout',
        msg: `Hardcoded "${pxMatch[0]}" found; prefer Atlas spacing, radius, or font-size tokens`,
        fix: isTypography
          ? 'Use var(--font-size-16) or typography utility classes from @design-atlas/css'
          : 'Use var(--spacing-8), var(--spacing-16), or var(--border-radius-4)',
        line: lineNum,
        col: (pxMatch.index || 0) + 1,
        ctx: snippet,
        token: pxMatch[2]
      };
      if (!isTypography && pxMatch[1] === 'border-radius' && pxMatch[2] === '4px') {
        issue.autoFix = { orig: '4px', repl: 'var(--border-radius-4)' };
      }
      pushIssue(issue);
    }

    // 6. Accessibility: outline: none without focus-visible replacement
    if (/outline\s*:\s*(none|0)\b/.test(line) && !code.includes('--border-color-focus') && !code.includes(':focus-visible')) {
      pushIssue({
        rule: 'atlas-a11y-focus-001',
        name: 'Visible focus indicator required',
        sev: 'w',
        cat: 'accessibility',
        msg: 'Removing focus outline without a token-based focus replacement breaks keyboard navigation',
        fix: 'Add :focus-visible styling using var(--border-color-focus) or var(--border-style-focus)',
        line: lineNum,
        col: line.indexOf('outline') + 1,
        ctx: snippet
      });
    }

    // 7. Accessibility: clickable non-interactive <div> or <span>
    if (/<(div|span)\b[^>]*(on:click|onClick)=/i.test(line) && !/role=/.test(line)) {
      pushIssue({
        rule: 'atlas-a11y-semantic-001',
        name: 'Use semantic interactive elements',
        sev: 'e',
        cat: 'accessibility',
        msg: 'Clickable <div> or <span> detected without an ARIA role',
        fix: 'Replace with native <button type="button"> for actions or <a href="..."> for navigation',
        line: lineNum,
        col: 1,
        ctx: snippet
      });
    }

    // 8. Accessibility: <img> missing alt attribute
    if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(line)) {
      pushIssue({
        rule: 'atlas-a11y-img-001',
        name: 'Image missing alt attribute',
        sev: 'e',
        cat: 'accessibility',
        msg: '<img> element is missing an alt attribute',
        fix: 'Add descriptive alt="..." text or alt="" for decorative images',
        line: lineNum,
        col: line.indexOf('<img') + 1,
        ctx: snippet
      });
    }

    // 9. i18n: hardcoded Portuguese aria-label or placeholder in reusable library code
    const ptMatch = line.match(/aria-label=["'](Limpar|Fechar|Abrir|Enviar|Buscar|Cancelar)[^"']*["']/i);
    if (ptMatch) {
      pushIssue({
        rule: 'atlas-i18n-001',
        name: 'Hardcoded non-English ARIA label',
        sev: 'w',
        cat: 'i18n',
        msg: `Hardcoded Portuguese label "${ptMatch[0]}" reduces reusability across OpenStreetMap locales`,
        fix: 'Use an English default and expose an overridable label prop',
        line: lineNum,
        col: (ptMatch.index || 0) + 1,
        ctx: snippet,
        token: ptMatch[0]
      });
    }
  });

  // 10. Accessibility: icon-only button check
  if (/<(?:button|AtlButton|Button)\b[^>]*>[\s\S]*?<\/(?:button|AtlButton|Button)>/i.test(code)) {
    const buttonTags = code.match(/<(?:button|AtlButton|Button)\b[^>]*>/gi) || [];
    for (const tag of buttonTags) {
      if ((tag.includes('icon-only') || tag.includes('iconOnly')) && !tag.includes('aria-label') && !tag.includes('aria-hidden')) {
        pushIssue({
          rule: 'atlas-a11y-button-001',
          name: 'Icon-only button missing accessible label',
          sev: 'e',
          cat: 'accessibility',
          msg: 'Icon-only buttons must provide aria-label (or aria-hidden when decorative)',
          fix: 'Add aria-label="Descriptive action"',
          line: 1,
          col: 1,
          comp: 'Button',
          ctx: tag.slice(0, 60)
        });
      }
    }
  }

  // 11. React package alignment reminder
  if (detectedFramework === 'react' && !code.includes('@design-atlas/')) {
    pushIssue({
      rule: 'atlas-comp-react-001',
      name: 'Import Atlas tokens or styles in React',
      sev: 'i',
      cat: 'components',
      msg: 'React component does not import @design-atlas/tokens or @design-atlas/css',
      fix: "Import '@design-atlas/tokens/css' or '@design-atlas/css' to guarantee visual parity with Svelte",
      line: 1,
      col: 1
    });
  }

  // 12. Naming convention: React/Svelte component exports must start with Atl
  if (detectedFramework === 'react' || detectedFramework === 'svelte') {
    const exportMatches = code.matchAll(/export\s+(?:const|function|class|default\s+function|default\s+class)\s+([A-Z][a-zA-Z0-9_]*)/g);
    for (const m of exportMatches) {
      const exportName = m[1];
      if (!exportName.startsWith('Atl')) {
        pushIssue({
          rule: 'atlas-naming-component-001',
          name: 'Component export must use Atl prefix',
          sev: 'w',
          cat: 'components',
          msg: `Exported component "${exportName}" does not start with "Atl"`,
          fix: `Rename "${exportName}" to "Atl${exportName}" (PascalCase with Atl prefix)`,
          line: 1,
          col: 1,
          token: exportName
        });
      }
    }
  }

  // 13. Naming convention: CSS root classes must use .atl- prefix
  if (detectedFramework === 'css' || code.includes('<style')) {
    const rootClassMatches = code.matchAll(/^\s*\.([a-z][a-z0-9-]*)\s*\{/gm);
    for (const m of rootClassMatches) {
      const cls = m[1];
      if (!cls.startsWith('atl-')) {
        pushIssue({
          rule: 'atlas-naming-css-001',
          name: 'CSS component class must use .atl- prefix',
          sev: 'w',
          cat: 'css',
          msg: `CSS class ".${cls}" does not follow the ".atl-<component>" convention`,
          fix: `Rename ".${cls}" to ".atl-${cls}"`,
          line: 1,
          col: 1,
          token: `.${cls}`
        });
      }
    }
  }

  // 14. Naming convention: Custom Elements (Web Components) must use atl- prefix
  const ceDefineMatches = code.matchAll(/customElements\.define\(\s*['"]([a-z][a-z0-9-]*)['"]/g);
  for (const m of ceDefineMatches) {
    const tag = m[1];
    if (!tag.startsWith('atl-')) {
      pushIssue({
        rule: 'atlas-naming-wc-001',
        name: 'Custom element tag must use atl- prefix',
        sev: 'e',
        cat: 'components',
        msg: `Custom element "${tag}" does not start with "atl-"`,
        fix: `Rename tag "${tag}" to "atl-${tag}"`,
        line: 1,
        col: 1,
        token: tag
      });
    }
  }

  const sev = {};
  const cat = {};
  for (const item of issues) {
    sev[item.sev] = (sev[item.sev] || 0) + 1;
    cat[item.cat] = (cat[item.cat] || 0) + 1;
  }

  const result = {
    valid: (sev.e || 0) === 0,
    total: issues.length,
    sev,
    cat,
    ...(issues.length > 0 ? { issues } : {}),
    ctx: `${detectedFramework}/${language}/${activeCategories.join(',')}`,
    took_ms: Date.now() - startedAt,
    validation_confidence: 0.85,
    analysis_method: 'regex',
    meta: { tool: 'atlas-check', v: '0.2.0' }
  };

  if (includeContext && issues.length > 0 && index) {
    const neededCats = new Set(issues.map((i) => i.cat));
    const relatedDocs = index.docs
      .filter((d) =>
        (neededCats.has('accessibility') && d.path.includes('accessibility')) ||
        (neededCats.has('css') && d.path.includes('class-first')) ||
        (neededCats.has('tokens') && d.path.includes('design-tokens/colors'))
      )
      .slice(0, 3)
      .map((d) => ({ title: d.title, path: d.path }));

    result.atlas_ctx = { docs: relatedDocs };
  }

  return result;
}

/**
 * Runs batch compliance audit across up to 50 files (matching carbon-mcp batch mode).
 *
 * @param {object} params
 * @param {Array<{ path: string, code: string, framework?: string }>} params.files
 * @param {string} [params.framework='auto']
 * @param {string[]} [params.categories]
 * @returns {object} Batch summary and per-file compact results.
 */
export function auditAtlasBatch({ files, framework = 'auto', categories }) {
  const startedAt = Date.now();
  const bounded = files.slice(0, 50);
  const results = bounded.map((file) => ({
    path: file.path,
    ...auditAtlasCode({
      code: String(file.code || ''),
      framework: file.framework || framework,
      filename: file.path || '',
      categories,
      includeContext: false
    })
  }));

  const totalIssues = results.reduce((acc, r) => acc + r.total, 0);
  const validFiles = results.filter((r) => r.valid).length;

  return {
    valid: validFiles === results.length,
    total_files: results.length,
    valid_files: validFiles,
    total_issues: totalIssues,
    took_ms: Date.now() - startedAt,
    results,
    meta: { tool: 'atlas-check', v: '0.2.0', mode: 'batch' }
  };
}
