# @design-atlas/mcp

Model Context Protocol (MCP) server for the **Design Atlas** design system (OpenStreetMap). Inspired by [`carbon-design-system/carbon-mcp`](https://github.com/carbon-design-system/carbon-mcp), it gives AI coding agents and Figma Make direct, structured access to Atlas design tokens, Svelte & React components, documentation, and code auditing.

## Tools

| Tool | Description |
| :--- | :--- |
| `docs_search` | Search component guidelines, style guides, token docs, and ADRs in `apps/docs`. |
| `code_search` | Retrieve component source code, props, and CSS custom properties across `@design-atlas/svelte`, `@design-atlas/react`, and `@design-atlas/css`. |
| `tokens_search` | Query `packages/tokens/tokens.json` and CSS variables (`--bgn-*`, `--color-*`, `--spacing-*`) including WCAG `AA`/`AAA` annotations. |
| `code_audit` | Audit Svelte, React, HTML, or CSS against Atlas rules (no hardcoded hex colors, no non-Atlas Tailwind color classes, Material Symbols icons, `aria-label` on icon-only buttons). |
| `components_inventory` | Inspect cross-framework parity between `@design-atlas/svelte` and `@design-atlas/react`. |

## Quick Start

### 1. Local `stdio` mode (Cursor, Claude Code, VS Code, Gemini CLI)

```json
{
  "mcpServers": {
    "design-atlas": {
      "command": "node",
      "args": ["./packages/mcp/bin/atlas-mcp.js"]
    }
  }
}
```

### 2. Streamable HTTP mode (Figma Make Custom Connector / Remote)

```bash
node ./packages/mcp/bin/atlas-mcp.js --transport http --port 3846
```

- MCP endpoint: `http://127.0.0.1:3846/mcp`
- Health check: `http://127.0.0.1:3846/health`

To connect **Figma Make** via Custom Connectors, expose this HTTP endpoint over HTTPS (for example via Cloudflare Tunnel or a hosted deployment) and register the `/mcp` URL in Figma Make (`Add context` -> `Connectors` -> `Manage` -> `Created by you` -> `Create`).

## Companion Skill

Pair this server with `skills/atlas-builder/SKILL.md` so AI agents follow Atlas's token-first, ADR-03 class-first, and React parity conventions automatically.
