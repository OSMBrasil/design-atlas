# Design Atlas CSS Nesting & Class-First Reference

## 1. Native CSS Nesting (Not Sass/SCSS)
Design Atlas uses **standard CSS Nesting** inside Svelte `<style>` blocks and CSS files (`@design-atlas/css`), not SCSS/Sass preprocessors.

### Allowed Pattern
```css
.atl-button {
  background-color: var(--bgn-accent);
  color: var(--color-inverse);

  &:hover {
    background-color: var(--bgn-accent-hover);
  }

  &.danger {
    background-color: var(--bgn-danger);

    &:hover {
      background-color: var(--bgn-danger-hover);
    }
  }

  &:disabled,
  &.disabled {
    background-color: var(--bgn-disable);
    cursor: not-allowed;
  }
}
```

### Forbidden Patterns
- **No Sass-only syntax**: Never write `$variable: value;`, `@mixin`, `@include`, or `@extend` in Atlas CSS.
- **No deep nesting (> 3 levels)**: Keep nesting at 1–3 levels maximum (`component -> state/variant -> pseudo-class`) to avoid high specificity and unreadable selectors.
- **No unlayered `:global(...)` overrides**: Scope component styles to the component root class (`.atl-*`).

## 2. Combining ADR-03 Class-First Utilities with Component Styles
Per `apps/docs/using-atlas/adrs/03-adr-adoption-of-class-first-approach-in-css.md`:
- Use `@design-atlas/css` utility classes (`.color-base`, `.color-error`, `.bgn-surface`, `.regular`, `.semibold`, `.border-style-base`) for layout composition and typography.
- Never mix Tailwind color/spacing utilities (`bg-blue-600`, `text-gray-700`, `px-4`) with Atlas CSS variables.
- When building React components (`@design-atlas/react`), share the exact same `.atl-*` CSS classes or CSS modules consuming `--bgn-*` / `--color-*` / `--spacing-*` custom properties.
