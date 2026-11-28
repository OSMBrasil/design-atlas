# AGENTS.md — Design Atlas Repository Guide for AI Agents

This file provides repository-wide instructions for AI coding agents (Claude Code, Cursor, GitHub Copilot, Gemini CLI, Codex) working on **Design Atlas** (`OSMBrasil/design-atlas`).

## Monorepo Structure
- `packages/tokens` (`@design-atlas/tokens`): Source-of-truth design tokens (`tokens.json`) and generated CSS custom properties (`dist/tokens.css`).
- `packages/css` (`@design-atlas/css`): Reset, theme, and class-first utility CSS (`atl-reset.css`, `atl-style.css`) per ADR-03.
- `packages/svelte` (`@design-atlas/svelte`): Primary component library (`AtlButton`, `AtlAlert`, `AtlTextInput`, etc.).
- `packages/react` (`@design-atlas/react`): Upcoming React component library (see `packages/react/ARCHITECTURE.md` for Svelte parity rules).
- `packages/mcp` (`@design-atlas/mcp`): Local/HTTP MCP server exposing `docs_search`, `code_search`, `tokens_search`, `code_audit`, and `components_inventory`.
- `skills/atlas-builder`: Companion AI skill with detailed references for accessibility, grid system, CSS nesting, common pitfalls, and Figma Make integration.
- `apps/docs`: VitePress documentation site (`apps/docs/components`, `apps/docs/design-tokens`, `apps/docs/style-guide`, `apps/docs/using-atlas/adrs`).
- `apps/storybook`: Storybook workspace for component demos.

## Mandatory Agent Rules
1. **Language**: All code, comments, JSDoc/TSDoc, docs, ADRs, and commit messages must be written in **English**.
2. **MCP-First**: Query `@design-atlas/mcp` (`components_inventory`, `tokens_search`, `code_search`, `docs_search`) before writing or modifying components, and run `code_audit` before finishing.
3. **Tokens Over Hardcoded Values**: Never hardcode hex colors or non-Atlas Tailwind color classes (`bg-blue-600`). Always use `--bgn-*`, `--color-*`, `--spacing-*`, `--border-*`, and `--font-*` CSS custom properties.
4. **Native CSS Nesting**: Use standard CSS `&` nesting (max 3 levels deep). Do not introduce Sass/SCSS syntax.
5. **Accessibility**: Target WCAG 2.0/2.1 AA (`4.5:1` text contrast, `48×48px` touch targets, `aria-label` on icon-only buttons, semantic `<button>`/`<a>` elements, visible focus states).
6. **Icons**: Standardize on **Google Material Symbols**; do not add third-party icon packages.
