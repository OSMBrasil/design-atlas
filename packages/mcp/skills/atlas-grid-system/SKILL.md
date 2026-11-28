---
name: atlas-grid-system
description: Responsive grid, spacing, container, and layout skill for Design Atlas (OpenStreetMap). Enforces Atlas spacing/size tokens, AtlContainer usage, and map-sidebar layout patterns.
---

# Atlas Grid System & Layout Skill

## Mission
Build consistent, responsive layouts using Design Atlas spacing, sizing, and container primitives without hardcoded pixel widths or arbitrary layout utilities.

## Repository Documentation Links
- [Spacing Tokens](../../apps/docs/design-tokens/spacing.md)
- [Size Tokens](../../apps/docs/design-tokens/size.md)
- [Breakpoint Tokens (WIP — currently empty)](../../apps/docs/design-tokens/breakpoint.md)
- [Content Overflow Guide](../../apps/docs/style-guide/content-overflow.md)
- [Container Component Demo](../../apps/docs/components/demos/container.md)
- [Container Svelte Implementation](../../packages/svelte/src/lib/AtlContainer.svelte)
- [CSS Variables Source](../../packages/tokens/src/variables.css)

## Responsive 12-Column Grid Specification
Because `apps/docs/design-tokens/breakpoint.md` is currently empty and `packages/tokens/tokens.json` does not yet define breakpoint/grid tokens, use this standardized responsive contract until formal breakpoint tokens are added:

| Tier | Min Width | Columns | Gutter | Margin |
| :--- | :--- | :--- | :--- | :--- |
| `sm` (Mobile) | `0px` (`320px` target) | `4` | `var(--spacing-16)` | `var(--spacing-16)` |
| `md` (Tablet) | `640px` (`40rem`) | `8` | `var(--spacing-16)` | `var(--spacing-24)` |
| `lg` (Desktop) | `1024px` (`64rem`) | `12` | `var(--spacing-24)` | `var(--spacing-32)` |
| `xl` (Wide) | `1280px` (`80rem`) | `12` | `var(--spacing-24)` | `var(--spacing-48)` |

## Layout Rules
1. **Spacing & Gaps**: Always use `var(--spacing-*)` tokens (`--spacing-4`, `--spacing-8`, `--spacing-16`, `--spacing-24`, `--spacing-32`) for `gap`, `padding`, and `margin`.
2. **Containers**: Wrap page sections with `AtlContainer` (or `Container` in React) and `--size-*` tokens instead of hardcoded `max-width` values.
3. **OpenStreetMap Map + Sidebar Pattern**: Pair a collapsible sidebar (`--size-320` to `--size-416`) with a fluid map canvas (`flex: 1; min-width: 0;`). Apply `min-width: 0` on grid/flex children to prevent overflow on long OSM tags or coordinates.
4. **MCP Check**: Query `tokens_search` with `query: "spacing"` or `query: "size"` before writing layout CSS.
