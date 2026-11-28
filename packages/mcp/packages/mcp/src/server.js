import { createServer } from 'node:http';
import { buildAtlasIndex } from './indexer.js';
import { auditAtlasBatch, auditAtlasCode } from './audit.js';

const SERVER_INFO = {
  name: 'design-atlas-mcp',
  version: '0.2.0'
};

const TOOL_DEFINITIONS = [
  {
    name: 'docs_search',
    description:
      'Search Design Atlas documentation, component usage guidelines, style guides, design token docs, and Architecture Decision Records (ADRs).',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keywords (e.g., "button", "accessibility", "class-first", "color tokens").'
        },
        category: {
          type: 'string',
          enum: ['all', 'components', 'design-tokens', 'style-guide', 'adrs', 'general'],
          description: 'Optional documentation category filter.'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of matching documents to return (default: 5).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'code_search',
    description:
      'Search Design Atlas component implementations, props, CSS custom properties, and CSS utilities across Svelte (@design-atlas/svelte), React (@design-atlas/react), and CSS (@design-atlas/css).',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Component name, prop, or CSS utility keyword (e.g., "Button", "AtlAlert", "variant").'
        },
        framework: {
          type: 'string',
          enum: ['all', 'svelte', 'react', 'css'],
          description: 'Filter by target framework or CSS package (default: "all").'
        },
        includeSource: {
          type: 'boolean',
          description: 'Include full component source code in results (default: true).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'tokens_search',
    description:
      'Search Design Atlas design tokens (tokens.json) and CSS custom properties (--bgn-*, --color-*, --spacing-*) including WCAG AA/AAA contrast annotations.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Token name, category, color value, or WCAG level (e.g., "accent", "olive", "spacing", "AAA").'
        },
        type: {
          type: 'string',
          description: 'Optional token $type filter (e.g., "color", "dimension", "fontFamily").'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of token matches to return (default: 20).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'code_audit',
    description:
      'Validate single-file or batch (up to 50 files) Svelte, React, HTML, or CSS code against Design Atlas guidelines. Returns compact JSON with categorized issues, severity counts (e/w/i), autoFix suggestions, and optional Atlas doc context.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Single-file source code to audit (mutually exclusive with files).'
        },
        files: {
          type: 'array',
          description: 'Batch mode: array of { path, code, framework? } objects (max 50 files).',
          items: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              code: { type: 'string' },
              framework: { type: 'string' }
            },
            required: ['path', 'code']
          }
        },
        framework: {
          type: 'string',
          enum: ['auto', 'svelte', 'react', 'css', 'html'],
          description: 'Framework context for the audit (default: "auto").'
        },
        filename: {
          type: 'string',
          description: 'Optional file path to improve framework/language auto-detection.'
        },
        categories: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['tokens', 'components', 'accessibility', 'layout', 'css', 'i18n']
          },
          description: 'Optional subset of audit categories to run.'
        },
        includeContext: {
          type: 'boolean',
          description: 'Attach relevant Atlas documentation pointers when issues are found (single-file mode only).'
        }
      }
    }
  },
  {
    name: 'components_inventory',
    description:
      'List all Design Atlas components and their cross-framework parity status across @design-atlas/svelte, @design-atlas/react, and documentation.',
    inputSchema: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          enum: ['all', 'missing-in-react', 'implemented-in-react'],
          description: 'Filter components by React parity status (default: "all").'
        }
      }
    }
  }
];

function scoreMatch(haystack, terms) {
  const lower = haystack.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (lower.includes(term)) {
      score += 1;
    }
  }
  return score;
}

export function createAtlasMcpHandler(options = {}) {
  const index = buildAtlasIndex(options.root);

  function executeTool(name, args = {}) {
    if (name === 'docs_search') {
      const query = String(args.query || '').trim();
      const category = args.category || 'all';
      const limit = Number(args.limit || 5);
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

      const matches = index.docs
        .filter((doc) => category === 'all' || doc.category === category)
        .map((doc) => {
          const titleScore = scoreMatch(doc.title, terms) * 3;
          const pathScore = scoreMatch(doc.path, terms) * 2;
          const bodyScore = scoreMatch(doc.content, terms);
          return { doc, score: titleScore + pathScore + bodyScore };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ doc, score }) => ({
          title: doc.title,
          category: doc.category,
          path: doc.path,
          score,
          excerpt: doc.content.slice(0, 1200)
        }));

      return { query, count: matches.length, results: matches };
    }

    if (name === 'code_search') {
      const query = String(args.query || '').trim();
      const framework = args.framework || 'all';
      const includeSource = args.includeSource !== false;
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

      const componentMatches = index.components
        .filter((c) => framework === 'all' || c.framework === framework)
        .map((comp) => {
          const score =
            scoreMatch(comp.name, terms) * 4 +
            scoreMatch(comp.canonicalName, terms) * 3 +
            scoreMatch(comp.source, terms);
          return { comp, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(({ comp }) => ({
          component_id: comp.canonicalName.toLowerCase(),
          name: comp.name,
          canonicalName: comp.canonicalName,
          framework: comp.framework,
          path: comp.path,
          props: comp.props,
          cssVarsUsed: comp.cssVarsUsed,
          ...(includeSource ? { source: comp.source } : {})
        }));

      const cssMatches =
        framework === 'all' || framework === 'css'
          ? index.cssAssets
              .filter((asset) => scoreMatch(`${asset.name} ${asset.content}`, terms) > 0)
              .map((asset) => ({
                name: asset.name,
                framework: 'css',
                path: asset.path,
                ...(includeSource ? { source: asset.content.slice(0, 2000) } : {})
              }))
          : [];

      return {
        query,
        componentsCount: componentMatches.length,
        cssAssetsCount: cssMatches.length,
        components: componentMatches,
        cssAssets: cssMatches
      };
    }

    if (name === 'tokens_search') {
      const query = String(args.query || '').trim();
      const typeFilter = args.type ? String(args.type).toLowerCase() : null;
      const limit = Number(args.limit || 20);
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

      const jsonMatches = index.tokens
        .filter((t) => !typeFilter || t.type.toLowerCase() === typeFilter)
        .map((t) => ({
          token: t,
          score:
            scoreMatch(t.path, terms) * 3 +
            scoreMatch(String(t.value), terms) * 2 +
            scoreMatch(t.description, terms) +
            scoreMatch(t.cssVarHint, terms) * 2
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.token);

      const cssMatches = index.cssVariables
        .filter((v) => scoreMatch(`${v.name} ${v.value}`, terms) > 0)
        .slice(0, limit);

      return {
        query,
        tokensCount: jsonMatches.length,
        cssVariablesCount: cssMatches.length,
        tokens: jsonMatches,
        cssVariables: cssMatches
      };
    }

    if (name === 'code_audit') {
      if (Array.isArray(args.files) && args.files.length > 0) {
        return auditAtlasBatch({
          files: args.files,
          framework: args.framework || 'auto',
          categories: args.categories
        });
      }
      if (typeof args.code !== 'string') {
        throw new Error('code_audit requires either `code` (string) or `files` (array).');
      }
      return auditAtlasCode({
        code: args.code,
        framework: args.framework || 'auto',
        filename: args.filename || '',
        categories: args.categories,
        includeContext: Boolean(args.includeContext),
        index
      });
    }

    if (name === 'components_inventory') {
      const filter = args.filter || 'all';
      const items = index.inventory.filter((item) => {
        if (filter === 'missing-in-react') return !item.react;
        if (filter === 'implemented-in-react') return Boolean(item.react);
        return true;
      });
      return {
        totalComponents: index.inventory.length,
        svelteCount: index.inventory.filter((i) => i.svelte).length,
        reactCount: index.inventory.filter((i) => i.react).length,
        filter,
        components: items
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  }

  function listResources() {
    return [
      {
        uri: 'atlas://components/inventory',
        name: 'Design Atlas Components Inventory',
        description: 'Cross-framework parity inventory for Svelte, React, and documentation.',
        mimeType: 'application/json'
      },
      {
        uri: 'atlas://tokens/summary',
        name: 'Design Atlas Tokens Summary',
        description: 'Flattened Design Atlas tokens and CSS custom properties.',
        mimeType: 'application/json'
      }
    ];
  }

  function readResource(uri) {
    if (uri === 'atlas://components/inventory') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(index.inventory, null, 2)
          }
        ]
      };
    }
    if (uri === 'atlas://tokens/summary') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                totalJsonTokens: index.tokens.length,
                totalCssVariables: index.cssVariables.length,
                sampleCssVariables: index.cssVariables.slice(0, 50)
              },
              null,
              2
            )
          }
        ]
      };
    }
    throw new Error(`Resource not found: ${uri}`);
  }

  function handleJsonRpc(msg) {
    const { id, method, params } = msg || {};
    if (method === 'notifications/initialized') return null;

    try {
      if (method === 'initialize') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {}, resources: {} },
            serverInfo: SERVER_INFO
          }
        };
      }
      if (method === 'ping') return { jsonrpc: '2.0', id, result: {} };
      if (method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools: TOOL_DEFINITIONS } };
      if (method === 'tools/call') {
        const output = executeTool(params?.name, params?.arguments || {});
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(output, null, 2) }] }
        };
      }
      if (method === 'resources/list') return { jsonrpc: '2.0', id, result: { resources: listResources() } };
      if (method === 'resources/read') return { jsonrpc: '2.0', id, result: readResource(params?.uri) };

      return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32000, message: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  return { index, handleJsonRpc };
}

export function startStdioServer(options = {}) {
  const handler = createAtlasMcpHandler(options);
  let buffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const response = handler.handleJsonRpc(JSON.parse(trimmed));
        if (response !== null) process.stdout.write(`${JSON.stringify(response)}\n`);
      } catch (err) {
        process.stdout.write(
          `${JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: `Parse error: ${err.message}` } })}\n`
        );
      }
    }
  });
}

export function startHttpServer(options = {}) {
  const port = Number(options.port || 3846);
  const host = options.host || '127.0.0.1';
  const handler = createAtlasMcpHandler(options);

  const server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          status: 'ok',
          server: SERVER_INFO,
          indexed: {
            tokens: handler.index.tokens.length,
            cssVariables: handler.index.cssVariables.length,
            docs: handler.index.docs.length,
            components: handler.index.components.length
          }
        })
      );
      return;
    }

    if (req.method === 'POST' && req.url === '/mcp') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const response = handler.handleJsonRpc(JSON.parse(body));
          if (response === null) {
            res.writeHead(202);
            res.end();
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: `Parse error: ${err.message}` } })
          );
        }
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found. Use POST /mcp or GET /health.' }));
  });

  server.listen(port, host, () => {
    console.error(`[design-atlas-mcp] HTTP server listening on http://${host}:${port}/mcp`);
  });

  return server;
}
