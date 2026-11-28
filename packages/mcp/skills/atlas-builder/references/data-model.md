# Design Atlas MCP Data Model & Query Guide

## Available Tools in `@design-atlas/mcp`

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `docs_search` | Search VitePress docs, ADRs, style guide, and component demos. | `query` (required), `category` (`all` \| `components` \| `design-tokens` \| `style-guide` \| `adrs` \| `general`), `limit` |
| `code_search` | Search Svelte, React, and CSS implementations + props. | `query` (required), `framework` (`all` \| `svelte` \| `react` \| `css`), `includeSource` |
| `tokens_search` | Search `tokens.json` and CSS variables (`--*`) + WCAG tags. | `query` (required), `type` (`color` \| `dimension` \| `fontFamily`), `limit` |
| `code_audit` | Lint code against Atlas token, nesting, icon, and a11y rules. | `code` (required), `framework` (`auto` \| `svelte` \| `react` \| `css` \| `html`) |
| `components_inventory` | Check Svelte vs. React parity and docs coverage. | `filter` (`all` \| `missing-in-react` \| `implemented-in-react`) |

## Available MCP Resources
- `atlas://components/inventory` — JSON parity matrix across Svelte, React, and docs.
- `atlas://tokens/summary` — Token counts and CSS custom property sample.

## Token Conservation Strategy
1. Start with `components_inventory` (`includeSource` not needed) to see what exists.
2. Call `code_search` with `includeSource: false` when you only need props and CSS variables, or `includeSource: true` when porting a Svelte component to React.
3. Keep `tokens_search` `limit` small (`10–20`) with specific terms (`accent`, `danger`, `spacing`, `AAA`).
