# Design Atlas Accessibility Skill Reference

## Standard & Target
Design Atlas targets **WCAG 2.0 / 2.1 Level AA** compliance across all OpenStreetMap interfaces (`apps/docs/style-guide/accessibility.md`).

## 1. Color & Contrast
- **Never rely on color alone** to convey state (`error`, `success`, `warning`, `info`). Always pair color with an icon, text label, or border change.
- **Minimum contrast ratios**:
  - **4.5:1** for normal text.
  - **3:1** for large text (`18pt+` or bold `14pt+`) and UI components/focus indicators.
- Always check `tokens_search` for `$description` (`AA` / `AAA`) before pairing foreground (`--color-*`) and background (`--bgn-*`) tokens.

## 2. Touch Targets & Focus
- **Minimum touch target**: `48×48px` for primary interactive mobile/map controls (`min-height: var(--size-48)` or adequate padding).
- **Visible focus state**: Never use `outline: none` without a replacement token-based focus ring (`--border-color-focus` / `--border-style-focus`).

## 3. Component ARIA & Keyboard Contracts
- **Button (`AtlButton` / `Button`)**:
  - Icon-only buttons **must** have `aria-label` (or `aria-hidden="true"` if decorative).
  - Use `<button type="button|submit|reset">`, never clickable `<div>` or `<span>`.
- **Links (`AtlLink`)**: Use `<a href="...">` for navigation; reserve `<button>` for in-page actions.
- **Form Controls (`AtlField`, `AtlTextInput`, `AtlTextArea`, `AtlSelect`, `AtlCheckbox`, `AtlRadio`, `AtlToggleSwitch`)**:
  - Every input must have an associated `<label for="...">` or `aria-label` / `aria-labelledby`.
  - Error and helper messages must be linked via `aria-describedby` and `aria-invalid="true"` when `status === "error"`.
- **Tabs (`AtlTabs`)**: Implement `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, and arrow-key navigation.
- **Accordion (`AtlAccordion`)**: Use `<button aria-expanded="..." aria-controls="...">` inside headings.
- **Alert (`AtlAlert`)**: Use `role="alert"` (assertive) or `role="status"` (polite) for dynamic feedback.

## 4. Internationalization & Bidirectionality (i18n / RTL)
- OpenStreetMap is global: never hardcode non-English strings inside library components (e.g., avoid hardcoded Portuguese `aria-label`s; accept `clearLabel` or `ariaLabel` props with English defaults).
- Prefer CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`) over `left`/`right` so RTL layouts work automatically.
