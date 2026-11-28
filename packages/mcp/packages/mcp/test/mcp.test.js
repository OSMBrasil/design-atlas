import assert from 'node:assert/strict';
import { createAtlasMcpHandler } from '../src/server.js';

const handler = createAtlasMcpHandler();

// 1. Initialize handshake
const initRes = handler.handleJsonRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
assert.equal(initRes.result.serverInfo.name, 'design-atlas-mcp');
assert.equal(initRes.result.serverInfo.version, '0.2.0');

// 2. List tools
const toolsRes = handler.handleJsonRpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
assert.equal(toolsRes.result.tools.length, 5);

// 3. Search tokens
const tokensRes = handler.handleJsonRpc({
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: { name: 'tokens_search', arguments: { query: 'olive' } }
});
const tokensPayload = JSON.parse(tokensRes.result.content[0].text);
assert.ok(tokensPayload.tokensCount > 0, 'Expected olive tokens to be indexed');

// 4. Search Svelte & React code
const codeRes = handler.handleJsonRpc({
  jsonrpc: '2.0',
  id: 4,
  method: 'tools/call',
  params: { name: 'code_search', arguments: { query: 'Button' } }
});
const codePayload = JSON.parse(codeRes.result.content[0].text);
assert.ok(codePayload.componentsCount >= 2, 'Expected both AtlButton (Svelte) and AtlButton (React)');

// 5. Compact single-file code_audit on placeholder React Button (with includeContext)
const reactButton = codePayload.components.find((c) => c.framework === 'react');
const auditRes = handler.handleJsonRpc({
  jsonrpc: '2.0',
  id: 5,
  method: 'tools/call',
  params: {
    name: 'code_audit',
    arguments: { code: reactButton.source, framework: 'react', filename: 'Button.tsx', includeContext: true }
  }
});
const auditPayload = JSON.parse(auditRes.result.content[0].text);
assert.equal(auditPayload.valid, false, 'Placeholder React Button should fail Tailwind color audit');
assert.ok(auditPayload.sev.e > 0, 'Expected compact sev.e count');
assert.ok(auditPayload.cat.tokens > 0, 'Expected compact cat.tokens count');
assert.ok(auditPayload.issues.some((i) => i.autoFix && i.autoFix.repl), 'Expected autoFix replacement on Tailwind class');
assert.ok(auditPayload.atlas_ctx?.docs?.length > 0, 'Expected includeContext to attach Atlas docs');

// 6. Batch code_audit across multiple files (Sass, nesting depth, a11y, i18n)
const batchRes = handler.handleJsonRpc({
  jsonrpc: '2.0',
  id: 6,
  method: 'tools/call',
  params: {
    name: 'code_audit',
    arguments: {
      files: [
        {
          path: 'src/BadComponent.jsx',
          code: '<div onClick={() => {}}><img src="/map.png" /><button aria-label="Limpar campo">X</button></div>'
        },
        {
          path: 'src/BadStyles.css',
          code: '@include my-mixin;\n.a { .b { .c { &:hover { color: #ff0000; } } } }'
        }
      ]
    }
  }
});
const batchPayload = JSON.parse(batchRes.result.content[0].text);
assert.equal(batchPayload.valid, false);
assert.equal(batchPayload.total_files, 2);
const allRules = batchPayload.results.flatMap((r) => (r.issues || []).map((i) => i.rule));
assert.ok(allRules.includes('atlas-css-nesting-002'), 'Expected Sass syntax error');
assert.ok(allRules.includes('atlas-css-nesting-001'), 'Expected nesting depth warning');
assert.ok(allRules.includes('atlas-a11y-semantic-001'), 'Expected clickable div error');
assert.ok(allRules.includes('atlas-a11y-img-001'), 'Expected missing img alt error');
assert.ok(allRules.includes('atlas-i18n-001'), 'Expected Portuguese ARIA label warning');

// 7. Components inventory
const invRes = handler.handleJsonRpc({
  jsonrpc: '2.0',
  id: 7,
  method: 'tools/call',
  params: { name: 'components_inventory', arguments: { filter: 'missing-in-react' } }
});
const invPayload = JSON.parse(invRes.result.content[0].text);
assert.ok(invPayload.components.length > 10, 'Expected Svelte components missing in React to be listed');
assert.ok(invPayload.components.every((c) => c.name.startsWith('Atl') && c.cssClass.startsWith('.atl-') && c.webComponentTag.startsWith('atl-')), 'Expected inventory to report Atl*, .atl-*, and atl-* naming');

// 8. Naming convention audit rules (component export, CSS root class, custom element)
const namingAuditRes = handler.handleJsonRpc({
  jsonrpc: '2.0',
  id: 8,
  method: 'tools/call',
  params: {
    name: 'code_audit',
    arguments: {
      files: [
        { path: 'src/MyButton.tsx', code: 'export const MyButton = () => <button>Hi</button>;' },
        { path: 'src/button.css', code: '.button { color: var(--color-base); }' },
        { path: 'src/wc.js', code: "customElements.define('my-button', class extends HTMLElement {});" }
      ]
    }
  }
});
const namingPayload = JSON.parse(namingAuditRes.result.content[0].text);
const namingRules = namingPayload.results.flatMap((r) => (r.issues || []).map((i) => i.rule));
assert.ok(namingRules.includes('atlas-naming-component-001'), 'Expected non-Atl component export warning');
assert.ok(namingRules.includes('atlas-naming-css-001'), 'Expected non-.atl- CSS class warning');
assert.ok(namingRules.includes('atlas-naming-wc-001'), 'Expected non-atl- custom element error');

console.log('✅ All @design-atlas/mcp v0.2.0 tests passed!');
console.log(
  `   Indexed: ${handler.index.tokens.length} tokens, ${handler.index.cssVariables.length} CSS vars, ${handler.index.docs.length} docs, ${handler.index.components.length} components`
);
