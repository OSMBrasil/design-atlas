# Design Atlas — Agent Instructions

This repository is the **Design Atlas** monorepo (`OSMBrasil/design-atlas`).

## Official Naming Convention

See [docs/development.md](docs/development.md#naming-convention) and [apps/docs/using-atlas/developing.md](apps/docs/using-atlas/developing.md#naming-convention) for the full specification:

- **Framework Components (Svelte & React):** PascalCase with `Atl` prefix (`AtlButton`, `AtlAlert`, `AtlTextInput`, `AtlContainer`).
- **CSS Classes:** kebab-case with `.atl-` prefix (`.atl-button`, `.atl-alert`, `.atl-field`).
- **Web Components (Custom Elements):** kebab-case tag names with `atl-` prefix (`<atl-button>`, `<atl-alert>`).

All documentation, comments, skills, and code must be written in English.

## Component Architecture & Reference

- **Architectural Reference:** [`carbon-design-system/carbon-components-svelte`](https://github.com/carbon-design-system/carbon-components-svelte) is our reference for Svelte component architecture, folder layout (`src/<ComponentName>/`), compositional subcomponents (e.g., `Accordion` + `AccordionItem`), accessibility patterns, and shared utilities.
  - Use it strictly as an architectural and organizational reference: **never** copy Carbon text, `.bx--*` classes, or code verbatim. Always implement original Design Atlas code using `Atl*`, `.atl-*`, `<atl-*>`, `@design-atlas/css` tokens, and `@design-atlas/ms-icons`.
- **Folder-per-Component Standard (`packages/svelte/src/lib/`):** Every new or refactored Svelte component lives in its own PascalCase directory (`packages/svelte/src/lib/<ComponentName>/`) containing:
  - Main component: `Atl<ComponentName>.svelte`
  - Compositional subcomponents (when applicable): e.g., `AtlAccordionItem.svelte`
  - Local barrel export: `index.js` (re-exporting the main component as `default` plus named exports for the main component and its subcomponents)
- **Shared Svelte Utilities:** Reusable internal actions and helpers (such as `roving-focus.js`, `id-scope.js`, `aria-naming.js`) live in `packages/svelte/src/lib/utils/`.
- **Storybook Stories & MDX Docs (`apps/storybook/src/stories/`):** Use native `.stories.svelte` files (`@storybook/addon-svelte-csf` v5 with `render: template` in `defineMeta` and `ComponentProps<typeof Atl*>`—never wrapper `.svelte` components) paired with an attached `<Component>.mdx` page (`tags: ["!autodocs"]`) using GFM Markdown tables (`remark-gfm` is enabled; never write raw HTML `<table>` tags in MDX).
- **Rounded Container & `outline` Styling:** For bordered containers that support `outline={false}`, apply `overflow: hidden` on the outer container and scope first/last-item `border-*-radius` rules strictly to `.atl-*--outline` so hover/focus states never bleed outside rounded corners and borderless states never inherit rounded corners.
