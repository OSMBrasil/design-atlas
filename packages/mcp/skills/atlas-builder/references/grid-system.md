# Design Atlas Grid System & Responsive Layout Reference

## Current Gap Identified in Repository
- `apps/docs/design-tokens/breakpoint.md` is currently empty (0 bytes), and `packages/tokens/tokens.json` / `packages/css/src/utilities.css` do not yet define standardized grid or breakpoint CSS custom properties.
- Currently, only `AtlContainer` (`packages/svelte/src/lib/AtlContainer.svelte`) and spacing/dimension tokens (`--spacing-*`, `--size-*`) exist.

## Recommended Grid & Breakpoint Contract (Carbon-Inspired)
When building layouts or expanding `packages/tokens` and `packages/css`, follow this 12-column responsive CSS Grid architecture:

| Breakpoint | Min Width | Columns | Gutter | Margin |
| :--- | :--- | :--- | :--- | :--- |
| `sm` (Mobile) | `0px` (`320px` target) | `4` | `var(--spacing-16)` (`16px`) | `var(--spacing-16)` |
| `md` (Tablet) | `640px` (`40rem`) | `8` | `var(--spacing-16)` (`16px`) | `var(--spacing-24)` |
| `lg` (Desktop) | `1024px` (`64rem`) | `12` | `var(--spacing-24)` (`24px`) | `var(--spacing-32)` |
| `xl` (Wide) | `1280px` (`80rem`) | `12` | `var(--spacing-24)` (`24px`) | `var(--spacing-48)` |

## Layout Rules for AI Agents
1. **Use CSS Grid & Flexbox with Atlas Spacing Tokens**: Always use `gap: var(--spacing-16)` or `var(--spacing-24)` instead of arbitrary pixel gaps.
2. **Use `AtlContainer` / `Container` for page bounds**: Avoid inventing ad-hoc `max-width: 1140px` wrappers; use `--size-*` tokens or the container component.
3. **Map/Canvas Split Layouts (OSM-Specific)**: OpenStreetMap apps commonly pair a fixed/collapsible sidebar (`--size-320` to `--size-416`) with a full-bleed interactive map canvas (`flex: 1; min-width: 0;`). Ensure sidebars collapse cleanly on `sm`/`md` viewports without obscuring map controls.
4. **Fluid Spacing**: Prefer `min-width: 0` on grid/flex children to prevent horizontal overflow on long OSM tags, coordinates, or translated strings.
