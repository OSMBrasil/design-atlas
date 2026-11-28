---
name: atlas-css-nesting
description: CSS architecture skill for Design Atlas. Enforces native CSS nesting (&), ADR-03 class-first utilities from @design-atlas/css, and token-only styling without Sass/SCSS or Tailwind color utilities.
---

# Atlas CSS Nesting & Class-First Skill

## Mission
Keep stylesheets clean, low-specificity, and framework-agnostic by combining **native CSS nesting** with Design Atlas's **ADR-03 class-first utility system**.

## Repository Documentation Links
- [ADR-03: Adoption of Class-First Approach in CSS](../../apps/docs/using-atlas/adrs/03-adr-adoption-of-class-first-approach-in-css.md)
- [ADR-01: Design Tokens](../../apps/docs/using-atlas/adrs/01-adr-design-tokens.md)
- [Design Tokens Definition & Structure](../../apps/docs/design-tokens/definition-and-structure.md)
- [Utility Classes (`@design-atlas/css`)](../../packages/css/src/utilities.css)
- [Theme CSS (`@design-atlas/css`)](../../packages/css/src/theme.css)
- [Reset CSS (`@design-atlas/css`)](../../packages/css/src/reset.css)
- [Reference Nested CSS Component (`AtlButton.svelte`)](../../packages/svelte/src/lib/AtlButton.svelte)

## Rules
1. **Native CSS Nesting Only**:
   - Use standard CSS `&` nesting inside Svelte `<style>` blocks and `.css` files (e.g., `&:hover`, `&.danger`, `&:disabled`).
   - **Maximum 3 levels deep** (`component -> variant/state -> pseudo-class`). Deeper nesting inflates specificity and triggers `atlas/css-nesting-depth` in `code_audit`.
   - **No Sass/SCSS**: Never use `@mixin`, `@include`, `@extend`, or `$variable:` declarations.
2. **ADR-03 Class-First Utilities & `.atl-*` Naming**:
   - Component root classes must use kebab-case with the `.atl-` prefix (e.g., `.atl-button`, `.atl-alert`, `.atl-field`).
   - Prefer `@design-atlas/css` utility classes (`.color-base`, `.color-error`, `.bgn-surface`, `.bgn-accent`, `.border-style-base`, `.regular`, `.semibold`) over custom one-off CSS rules.
   - Never use Tailwind color/spacing utilities (`bg-blue-600`, `text-gray-700`, `px-4`).
3. **Token-Only Values**:
   - Replace hardcoded hex colors and pixel values with `--color-*`, `--bgn-*`, `--border-*`, `--spacing-*`, and `--font-*` custom properties.

## MCP Verification
Query `code_search` with `framework: "css"` to inspect available utilities, and run `code_audit` on any new or edited CSS.
