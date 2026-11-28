---
name: atlas-accessibility
description: Accessibility engineering skill for Design Atlas (OpenStreetMap). Enforces WCAG 2.0/2.1 Level AA contrast, 48x48px touch targets, keyboard navigation, ARIA semantics, and i18n/RTL patterns grounded in Atlas documentation.
---

# Atlas Accessibility Skill

## Mission
Ensure every UI component and layout built with Design Atlas meets **WCAG 2.0 / 2.1 Level AA** so OpenStreetMap remains accessible to users with visual, motor, or assistive-technology needs.

## Repository Documentation Links
- [Accessibility Guide](../../apps/docs/style-guide/accessibility.md)
- [Bidirectionality (RTL/LTR)](../../apps/docs/style-guide/bidirectionality.md)
- [Constructing Forms](../../apps/docs/style-guide/constructing-forms.md)
- [Using Links and Buttons](../../apps/docs/style-guide/using-links-and-buttons.md)
- [Icons Guide](../../apps/docs/style-guide/icons.md)
- [Color Tokens](../../apps/docs/design-tokens/colors.md)
- [Token Contrast Metadata (`AA` / `AAA`)](../../packages/tokens/tokens.json)

## Mandatory Rules
1. **Color & Contrast**:
   - Never rely on color alone to communicate `error`, `success`, `warning`, or `info` states; pair with icons or text.
   - Maintain at least **4.5:1** contrast for normal text and **3:1** for large text (`18pt+` or bold `14pt+`) and UI focus borders.
   - Query `@design-atlas/mcp` `tokens_search` with `query: "AA"` or `"AAA"` to verify token contrast pairings.
2. **Touch Targets & Focus**:
   - Interactive controls must meet a **48×48px** minimum touch target where applicable.
   - Never use `outline: none` without a visible replacement focus ring (`--border-color-focus` / `--border-style-focus`).
3. **Semantic HTML & ARIA**:
   - Never attach `on:click` / `onClick` to `<div>` or `<span>`; use `<button>` for actions and `<a href>` for navigation.
   - Icon-only buttons **must** include `aria-label` (or `aria-hidden="true"` when purely decorative).
   - Every `<img>` requires an `alt` attribute (`alt=""` for decorative images).
   - Form fields (`AtlField`, `AtlTextInput`, `AtlSelect`, `AtlTextArea`) must link `<label for>` and `aria-describedby` / `aria-invalid` on errors.
4. **Internationalization & Bidirectionality**:
   - Do not hardcode non-English strings inside reusable library components; expose label props with English defaults.
   - Use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`) instead of `left`/`right`.

## MCP Verification
Run `code_audit` via `@design-atlas/mcp` on every component or template before finalizing.
