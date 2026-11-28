# Design Atlas Framework Rules

## 1. Design Tokens & Class-First CSS (ADR-01 & ADR-03)
- **Source of Truth**: `packages/tokens/tokens.json` and `packages/tokens/dist/tokens.css`.
- **Utility & Theme Layer**: `packages/css/dist/atl-style.css` and `packages/css/dist/atl-reset.css`.
- **Rule**: Never hardcode hex colors (`#3b82f6`) or pixel spacing (`16px`) when an Atlas CSS variable exists (`--bgn-accent`, `--color-base`, `--spacing-16`, `--border-radius-4`, `--font-size-16`).

## 2. Svelte (`@design-atlas/svelte`)
- Components use the `Atl` prefix (e.g., `AtlButton`, `AtlAlert`, `AtlTextInput`).
- Variants follow Atlas semantics: default (`primary`), `outline`, `tertiary`, `danger`.
- Always query `code_search` with `framework: "svelte"` to inspect exact prop names and slots/snippets (`{@render children?.()}`).

## 3. React (`@design-atlas/react`) — Future Parity Standard
- **Naming Convention**: React components use the `Atl` prefix (`AtlButton`, `AtlButtonProps`), `.atl-*` CSS classes, and align with future `<atl-*>` Web Components.
- **Target Architecture**:
  - Mirror Svelte component APIs and semantic variants (`primary` | `outline` | `tertiary` | `danger`).
  - Consume `@design-atlas/tokens/css` and `@design-atlas/css` CSS custom properties instead of Tailwind color classes.
  - Export typed props (`AtlButtonProps`, etc.) and `forwardRef` support for seamless integration with **Figma Code Connect** (`*.figma.tsx`).

## 4. Icons
- Design Atlas uses **Google Material Symbols** (`https://fonts.google.com/icons`).
- Never bundle `lucide-react`, `@heroicons/react`, or `@carbon/icons-react` in Atlas components.
