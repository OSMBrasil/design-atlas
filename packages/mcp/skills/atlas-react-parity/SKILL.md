---
name: atlas-react-parity
description: React component authoring skill for Design Atlas (@design-atlas/react). Guides Svelte-to-React component parity, token-based styling, TypeScript props, and Figma Code Connect readiness.
---

# Atlas React Parity Skill

## Mission
Build `@design-atlas/react` components with full visual, semantic, and accessibility parity with `@design-atlas/svelte` (`Atl*` components) while preparing each component for **Figma Code Connect**.

## Repository Documentation Links
- [React Architecture & Parity Roadmap](../../packages/react/ARCHITECTURE.md)
- [Current React Placeholder (`Button.tsx`)](../../packages/react/src/Button.tsx)
- [React Package Manifest](../../packages/react/package.json)
- [Svelte Components Export Index](../../packages/svelte/src/lib/index.js)
- [Components Overview](../../apps/docs/components/overview.md)
- [ADR-02: Svelte Decision Record](../../apps/docs/using-atlas/adrs/02-svelte.md)

## Rules
1. **Official Naming Convention**: All React components must use the `Atl*` PascalCase prefix (e.g., `AtlButton`, `AtlAlert`) with `Atl*Props` interfaces, `.atl-*` kebab-case CSS classes, and align with future `<atl-*>` Web Components.
2. **Do Not Copy the Placeholder `Button.tsx` Pattern**: `packages/react/src/Button.tsx` currently uses Tailwind classes (`bg-blue-600`) that fail `code_audit`. New and refactored React components must consume `@design-atlas/tokens/css` and `@design-atlas/css`.
3. **Match Svelte Variants & Behavior**: Query `code_search` with `framework: "svelte"` before implementing any React component so variants (`primary`, `outline`, `tertiary`, `danger`), disabled states, and slots/children match `Atl*` components.
4. **TypeScript & `forwardRef`**: Export `Atl<Component>Props` extending native HTML attributes (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`) and wrap components with `React.forwardRef`.
5. **Figma Code Connect Ready**: Keep component names and prop names aligned with the Atlas Figma Library so `*.figma.tsx` Code Connect bindings can be added cleanly.
