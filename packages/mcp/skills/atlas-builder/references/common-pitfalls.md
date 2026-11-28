# Design Atlas Common Pitfalls

Avoid these recurring mistakes observed in Design Atlas and AI-generated UI code:

1. **Using Tailwind color/spacing classes in `@design-atlas/react`**
   - *Pitfall*: `packages/react/src/Button.tsx` currently uses `bg-blue-600`, `text-gray-700`, `px-4 py-2`, which completely bypasses `@design-atlas/tokens` and fails `code_audit`.
   - *Fix*: Style React components using `@design-atlas/tokens/css` variables (`var(--bgn-accent)`, `var(--color-inverse)`) and `@design-atlas/css` classes.

2. **Hardcoding hex colors or pixel values**
   - *Pitfall*: Writing `color: #333333;` or `padding: 12px 36px;` (e.g., inline styles in `AtlTextInput.svelte`).
   - *Fix*: Query `tokens_search` and use `var(--color-base)`, `var(--spacing-12)`, `var(--spacing-36)`.

3. **Hardcoding Portuguese strings or comments in library source**
   - *Pitfall*: Leaving `/*Por enquanto os icones...*/` or `aria-label="Limpar campo"` inside reusable components.
   - *Fix*: Write all code, comments, docs, and default labels in English, and expose props (e.g. `clearLabel = "Clear input"`) for localization.

4. **Using third-party icon libraries**
   - *Pitfall*: Importing `lucide-react`, `@heroicons/react`, or `@carbon/icons-react`.
   - *Fix*: Atlas standardizes on **Google Material Symbols** (`apps/docs/style-guide/icons.md`).

5. **Mixing Svelte 4 and Svelte 5 syntax inconsistently**
   - *Pitfall*: Using `export let` alongside Svelte 5 `{@render children?.()}` without documenting runes/compatibility, or forgetting `on:click` vs `onclick` in Svelte 5.
   - *Fix*: Check `code_search` for the component's exact Svelte pattern before editing or wrapping it.

6. **Assuming `breakpoint.md` or grid tokens exist**
   - *Pitfall*: Referencing non-existent CSS variables like `--breakpoint-md` or `--grid-columns` without checking `tokens_search`.
   - *Fix*: Consult `references/grid-system.md` and `tokens_search` before writing responsive CSS.

7. **Icon-only buttons without accessible labels**
   - *Pitfall*: Rendering `<AtlButton withIcon>` or `<button class="icon-only">` without `aria-label`.
   - *Fix*: Always provide `aria-label` (or `aria-hidden="true"` when purely decorative).

8. **Inconsistent component, CSS, or Web Component naming**
   - *Pitfall*: Exporting `Button` instead of `AtlButton`, using `.button` instead of `.atl-button`, or defining `<my-button>` instead of `<atl-button>`.
   - *Fix*: Always use `Atl*` (Svelte/React), `.atl-*` (CSS), and `<atl-*>` (Web Components).
