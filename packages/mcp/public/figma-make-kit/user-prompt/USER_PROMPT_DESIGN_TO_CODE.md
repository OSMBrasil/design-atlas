# Design Atlas — Figma Make Design-to-Code User Prompt

Refactor the input Figma design into accessible, production-ready React components using **Design Atlas** (`@design-atlas/tokens`, `@design-atlas/css`, and `@design-atlas/react`) with **native CSS nesting** (no Tailwind CSS, no Sass/SCSS, no `lucide-react`).

## FIRST ACTIONS (MANDATORY)
1. Call `@design-atlas/mcp` tools before writing any code:
   - `components_inventory` to verify which components exist in `@design-atlas/react` vs `@design-atlas/svelte`.
   - `code_search` for every component you plan to use or port from Svelte.
   - `tokens_search` for every color, spacing, border, and typography token.
   - `docs_search` for accessibility and usage rules.
2. Do NOT inspect `node_modules` or guess token names in place of MCP calls.
3. Include an `MCP-PROVENANCE` JSON block in your response mapping every Atlas symbol/token to the MCP tool call that retrieved it.

## STYLING & ACCESSIBILITY RULES
- Follow the official naming convention: `Atl*` for React/Svelte components (`AtlButton`, `AtlAlert`), `.atl-*` for CSS classes (`.atl-button`), and `<atl-*>` for Web Components (`<atl-button>`).
- Style exclusively with `@design-atlas/tokens/css` variables (`--bgn-*`, `--color-*`, `--spacing-*`, `--font-size-*`, `--border-radius-*`) and `@design-atlas/css` ADR-03 utility classes.
- Use **native CSS nesting (`&`)** up to 3 levels deep; never emit `@mixin`, `@include`, or `$var:` Sass syntax.
- Use **Google Material Symbols** for all icons.
- Follow WCAG 2.0/2.1 AA: `4.5:1` text contrast, `48×48px` touch targets, `aria-label` on icon-only buttons, semantic `<button>` / `<a>`, and visible focus states (`--border-color-focus`).

## FINAL COMPLIANCE GATE
Call `code_audit` in batch mode (`files[]`) across all emitted files and fix every error (`sev: "e"`) and warning (`sev: "w"`) before finalizing.
