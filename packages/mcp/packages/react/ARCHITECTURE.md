# `@design-atlas/react` Architecture & Parity Roadmap

## Purpose
This document defines the architecture for building production React components in `@design-atlas/react` with full visual and semantic parity with `@design-atlas/svelte` (`Atl*` components) and `@design-atlas/tokens`.

## Current State vs. Target State
- **Current**: `src/Button.tsx` is an early placeholder using Tailwind utility classes (`bg-blue-600`, `text-gray-700`), which bypasses Design Atlas tokens and fails `@design-atlas/mcp` `code_audit`.
- **Target**: Every React component consumes `@design-atlas/tokens/css` (`--bgn-*`, `--color-*`, `--spacing-*`, `--border-radius-*`) and `@design-atlas/css` classes, matching the exact CSS contract of `packages/svelte/src/lib/Atl*.svelte`.

## Design Principles (Aligned with Carbon & Atlas ADRs)
1. **Token-First Styling (ADR-01 & ADR-03)**: Use CSS custom properties from `@design-atlas/tokens` and shared CSS classes from `@design-atlas/css` rather than inline hex values or external utility frameworks.
2. **Svelte-to-React Component Parity (`Atl*` + `.atl-*`)**:
   - Tier 1 (Core Primitives): `AtlButton`, `AtlLink`, `AtlLabel`, `AtlContainer`, `AtlField`
   - Tier 2 (Form Controls): `AtlTextInput`, `AtlTextArea`, `AtlCheckbox`, `AtlRadio`, `AtlSelect`, `AtlToggleSwitch`
   - Tier 3 (Feedback & Navigation): `AtlAlert`, `AtlAccordion`, `AtlTabs`, `AtlTooltip`, `AtlMenu`, `AtlButtonGroup`
   - All React components must use the `Atl*` PascalCase prefix (and `Atl*Props`), `.atl-*` kebab-case CSS classes, and align with future `<atl-*>` Web Components.
3. **TypeScript & Accessibility**:
   - Export explicit `ComponentProps` interfaces extending native HTML element attributes (`React.ButtonHTMLAttributes<HTMLButtonElement>`, etc.) and `React.forwardRef`.
   - Enforce `aria-label` on icon-only buttons and WCAG `AA`/`AAA` token pairings.
4. **Figma Code Connect Ready**:
   - Keep component names and variant prop values (`primary`, `outline`, `tertiary`, `danger`) aligned with the Atlas Figma library so `*.figma.tsx` Code Connect mappings can be added directly as each component ships.
5. **AI & MCP Verification**:
   - Use `@design-atlas/mcp` (`code_search` on Svelte reference + `code_audit` on React output) during component implementation.
