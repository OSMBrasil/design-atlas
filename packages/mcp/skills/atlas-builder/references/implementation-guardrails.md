# Design Atlas Implementation Guardrails

Follow these mandatory guardrails whenever generating, reviewing, or refactoring Design Atlas code:

## 1. MCP-First Verification Gate
- **Before writing code**: Call `components_inventory` and `code_search` to check existing Svelte/React implementations and props.
- **Before styling**: Call `tokens_search` to verify exact CSS custom property names (`--bgn-*`, `--color-*`, `--spacing-*`, `--border-*`).
- **Before finalizing**: Run `code_audit` on your generated code and fix all `error` and `warning` findings.

## 2. Package & Import Discipline
- Tokens: `@design-atlas/tokens` (`@design-atlas/tokens/css`)
- Base styles & utilities: `@design-atlas/css` (`@design-atlas/css/atl-reset.css`, `@design-atlas/css/atl-style.css`)
- Svelte components: `@design-atlas/svelte` (`AtlButton`, `AtlAlert`, etc.)
- React components: `@design-atlas/react` (must maintain visual & variant parity with Svelte)

## 3. SSR & Bundle Safety
- Avoid accessing `window` or `document` at module top-level; guard browser-only logic inside lifecycle hooks (`onMount` in Svelte, `useEffect` in React).
- Keep `@design-atlas/react` `sideEffects: false` tree-shakeable.

## 4. Language & Documentation Standard
- All source code, JSDoc/TSDoc comments, ADRs, skill files, and component docs **must be written in English**.
- User-facing component labels must be overridable via props for OpenStreetMap's multilingual community.
