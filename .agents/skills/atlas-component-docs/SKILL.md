---
name: atlas-component-docs
description: End-to-end documentation workflow for Design Atlas components across folder-organized source code comments, Storybook stories and interaction tests, accessibility documentation, and VitePress pages. Use when asked to document a component, create or update stories, write or review a component docs page, or fill in the accessibility section.
---

# Atlas Component Documentation

Use this skill to document an Atlas component (`OSMBrasil/design-atlas` pnpm monorepo) end to end: source code documentation, Storybook, accessibility, and the VitePress page. The structure is inspired by Carbon Design System's separation (Usage, Style, Code, Accessibility) and [`carbon-design-system/carbon-components-svelte`](https://github.com/carbon-design-system/carbon-components-svelte) for Svelte folder organization and compositional subcomponents (such as `src/Accordion` with `Accordion` + `AccordionItem`). Never copy text, class names, or code from Carbon or any other design system; use only the organizational and architectural ideas, written in your own words with Atlas conventions (`Atl*`, `.atl-*`, `<atl-*>`, `@design-atlas/css`, `@design-atlas/ms-icons`).

## When to use

- Requests to document a component, create or update stories, write or review a component documentation page, or complete the accessibility section.
- Do **not** use this skill to set up or configure Storybook itself, nor to fix component bugs unless explicitly asked. When auditing or documenting, record any bugs or missing behaviors rather than hiding them.

## Step 0: Verify the repository state (it may have changed)

Inspect the current repository structure before taking action. Current monorepo layout:
- **Svelte components:** `packages/svelte/src/lib/`
  - **Folder-per-component standard (all new and refactored components):** each component lives in its own PascalCase directory (`packages/svelte/src/lib/<ComponentName>/`) containing the main `Atl<ComponentName>.svelte`, any compositional subcomponents (for example, `Accordion/AtlAccordion.svelte`, `Accordion/AtlAccordionItem.svelte`), and a local `index.js` barrel file.
  - Shared internal helpers (such as `roving-focus.js`, `id-scope.js`, `aria-naming.js`) live in `packages/svelte/src/lib/utils/`.
  - Legacy components not yet migrated may still sit directly under `packages/svelte/src/lib/Atl*.svelte`; `packages/svelte/build.js` supports both layouts.
- **React components:** `packages/react/src` (currently partial—check which components exist).
- **Storybook:** `apps/storybook` (Storybook 10 with `@storybook/svelte-vite`, `@storybook/addon-docs` + `remark-gfm`, `@storybook/addon-svelte-csf` v5, `@storybook/addon-a11y` in informative `"todo"` mode, and `@storybook/addon-vitest` + Playwright Chromium via `pnpm test:storybook`).
  - `apps/storybook/vitest.config.ts` keeps `storybookTest(...)` inside `test.projects` (never at the top level, and never duplicating the `svelte()` plugin) so Storybook's sidebar test widget matches `project: ["storybook:<configDir>"]`.
  - `apps/storybook/.storybook/preview.css` hides the `Default` column, renames `Control` → `Value` in Autodocs Controls tables, and removes zebra-striping on MDX Markdown tables.
- **VitePress docs:** `apps/docs` (component pages under `apps/docs/components/demos`).
- **CSS & tokens:** `packages/css` and `packages/tokens`.
- **Icons:** `packages/ms-icons` (`@design-atlas/ms-icons`, rendered via `AtlIcon`).

Also detect:
- Which Svelte syntax the component uses (Svelte 4 or 5—check before writing comments or stories).
- Whether the component is single-part or compositional (parent + subcomponents, context stores, slots).
- The language of existing documentation (English—all docs, comments, skills, and code must be in English per `AGENTS.md`).
- Whether a verification script already exists (for example, `docs:check`).

## Where everything lives

- **Source code (`packages/svelte/src/lib/<ComponentName>/`):** API documentation (props, types, defaults, accepted values, bindable props, dispatched events, named and default slots) lives in JSDoc comments alongside each component and subcomponent. Storybook extracts this automatically. **NEVER** write props tables by hand.
- **Storybook (`apps/storybook/src/stories/`):** Source of truth for behavior, interactive states, keyboard tests (`play` functions), and API per framework. Enable `tags: ["autodocs"]` on each component; use MDX only when prose beyond autodocs is needed.
- **VitePress (`apps/docs`):** Principles, when to use, anatomy, variants, styling (tokens used), content guidelines, and do/don't guidance. Embeds Storybook via `<iframe>` and links in both directions.

## Step-by-step per component

1. Read all files inside the component folder (main component, subcomponents, local `index.js`, and any utilities it uses), the React counterpart (if it exists), and the current VitePress documentation page. Describe only what the component actually does.
2. **Source code documentation comments:** Document every prop, bindable state, event payload, and slot (including named slots like `title` or `label`) in JSDoc comments—with default values and allowed values. Do not change logic, markup, or styling during a documentation-only task.
3. **Stories file** (native `<Component>.stories.svelte` using `@storybook/addon-svelte-csf` v5 under `apps/storybook/src/stories/`):
   - Use `<script module lang="ts">` with `defineMeta({ title: "Components/<Name>", component: Atl<Name>, tags: ["!autodocs"], render: template, args, argTypes })`.
   - Pass the shared `#snippet template` via `defineMeta({ render: template })`—**never** pass `render={...}` on individual `<Story>` tags (v5 ignores it and falls back to rendering `<AtlComponent {...args} />` without slotted children).
   - Type the template parameter with `ComponentProps<typeof Atl<Name>>` from `"svelte"`—**never** `Args<typeof Story>`, which causes a circular TypeScript error when `defineMeta` references `template`.
   - Do **not** create `.svelte` wrapper components for slotted/compositional components; compose `<AtlParent>` and `<AtlChild>` directly inside `#snippet template`.
   - Omit `subcomponents` from `defineMeta` when pairing with an attached `<Component>.mdx` page so Controls does not display a redundant subcomponent tab.
   - Use `BasicUsage` as the primary story name, plus one story per variant, layout option, and relevant state (`SingleMode`, `SingleItem`, `AlignStart`, `NoOutline`, `Disabled`, `DisabledItemKeyboardSkip`, `WithComponents`, `Error`, icon-only, etc.).
   - Group `argTypes` by category (`Content`, `Appearance`, `Behavior`, `State`, `Events`) with clear descriptions.
   - Add interactive `play` functions (using `expect` from `storybook/test`) covering user interactions and keyboard navigation (Arrow keys, `Home`, `End`, `Escape`, `Tab`, skipping disabled items) for interactive components.
   - Keep the **SAME** story names and IDs in Svelte and React for the same component (the docs `<iframe>` depends on this).
4. **Attached MDX documentation page (`<Component>.mdx`):**
   - Attach directly to the stories file with `<Meta of={ComponentStories} />` (importing `{ Meta, Canvas, Controls }` from `@storybook/addon-docs/blocks`).
   - Follow this exact section order:
     1. `# <Component>`
     2. `## Overview` (short description + `<Canvas of={ComponentStories.BasicUsage} />` + `<Controls of={ComponentStories.BasicUsage} />`)
     3. `## Examples` (one `###` subsection per variant/state with a short description and `<Canvas>`)
     4. `## Technical implementation` with three separate GFM Markdown tables: `### Events`, `### Props`, and `### Slots` (covering both parent and subcomponents)
     5. `## Keyboard Navigation` (GFM Markdown `Key | Action` table)
   - Always write standard GFM Markdown tables (`| Col | Col |`)—`remark-gfm` is enabled in `apps/storybook/.storybook/main.ts`; never write raw HTML `<table>` tags in `.mdx`.
5. **Accessibility section** (always required; follow the rules below).
6. **VitePress page:** Short introduction; when to use and when not to use; anatomy; variants and states; CSS tokens and variables used by their official names (`@design-atlas/css`); icons by their `@design-atlas/ms-icons` package name; content and writing guidelines; do and don't; embedded `<iframe>` pointing to the right story; links to the component folder source code and to Storybook.
7. **Iframe:** Descriptive `title` for screen readers, lazy loading (`loading="lazy"`), at most one or two per page, and a visible "Open in Storybook" link for the full experience (especially on mobile). Confirm that it is not blocked by deployment headers and that it follows light and dark themes.

## Accessibility section (mandatory)

Minimum required content:
- **Keyboard interaction:** Key × action table (including roving focus keys like `ArrowUp`/`ArrowDown`/`Home`/`End` when applicable).
- **ARIA roles and attributes:** Which ones are used (`aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`, etc.) and why.
- **Accessible name and label:** Where it comes from and how consumers provide it (including `aria-label` forwarding to the inner interactive control).
- **Focus management:** Tab order, visible focus indicator, roving focus scope (including nested widgets), and focus return when closing overlays/dialogs.
- **Visual and motion adaptation:** Behavior in high contrast, at 200% zoom, and with enlarged text; RTL mirroring where applicable; reduced motion when animations are present.
- **Known limitations.**
- **Testing status table** with columns: `Test`, `Type` (`Automated` or `Manual`), `Status` (`Tested`, `Not tested`, or `Failing`), and `Evidence` (date, tool, or link). Rows: default state, advanced states, keyboard navigation, and screen reader (specify which one: NVDA, VoiceOver, etc.).

**Honesty rule:** NEVER mark a row as `Tested` without evidence. If only `@storybook/addon-a11y` or `pnpm test:storybook` ran, the type is `Automated` and manual rows remain `Not tested`. Screen reader testing only counts if someone actually performed it and recorded which reader was used.

When reading the code, look specifically for:
- Labels properly associated with form fields
- Visible focus indicators
- Expected keyboard behavior (Arrow keys, `Home`, `End`, `Escape`, `Tab`) for the component's ARIA pattern
- Accessible names on icon-only buttons
- Hardcoded strings in a single language (should use `AtlLocaleProvider` / `i18n/messages.js`)
- Raw HTML injected with `{@html}` (prefer compositional slots/subcomponents)
- Contrast on disabled and error states
- Randomly generated IDs (prefer scoped IDs via `utils/id-scope.js`)
- Non-existent CSS variables

If something is missing or broken, do **NOT** document it as if it worked: record it under **Known limitations** and in the report's pending items list.

## Writing rules

- **Language:** English (`AGENTS.md`).
- **Tone:** Friendly, addressing the reader directly ("you"), short sentences, sentence case, no filler text.
- Remove or flag inherited text from other systems that does not apply to Atlas (for example, legacy mentions of "Codex icon" or claims that icon weight is adjustable via CSS for static SVGs).
- Keep code examples short, runnable, and consistent with the real API (showing compositional `<AtlParent><AtlChild>...</AtlChild></AtlParent>` usage where applicable).
- Never invent behavior, version numbers, test results, or Figma references. If you do not have the information, state that it has not been verified.

## Verification (prefer a script over spending tokens)

Run automated checks before finishing:
- `pnpm --filter @design-atlas/svelte build` (confirms folder-per-component exports compile cleanly)
- `pnpm test:storybook` (runs Storybook Vitest + Playwright interaction tests)

If a `docs:check` script exists, run it before and after your work. If it does not exist, propose creating one in Node.js (portable to Windows, with a `pnpm` shortcut) that verifies per component:
- Component folder structure (`packages/svelte/src/lib/<ComponentName>/`) and `index.js`
- Stories file exists in `apps/storybook/src/stories/`
- VitePress page exists in `apps/docs/`
- Props, events, and slots have JSDoc comments
- Story IDs match between Svelte and React (when a React counterpart exists)
- The page includes the accessibility section with the testing status table
- No `<iframe>` points to a non-existent story

Output a `Component × Item × OK/Missing` table and exit with a non-zero status code if anything mandatory is missing.

## Definition of done

- Component files follow the folder-per-component convention (`packages/svelte/src/lib/<ComponentName>/`).
- Stories and autodocs render without errors.
- Accessibility addon reports no violations, or deviations are explicitly justified in the documentation.
- Vitest `play` interaction tests cover keyboard behavior for interactive components and pass (`pnpm test:storybook`).
- Package build (`pnpm --filter @design-atlas/svelte build`) succeeds.
- VitePress page renders the `<iframe>` properly in both light and dark themes.
- No test claims without evidence.
- No text or code copied from another design system.

## What to report at the end

- Created and modified files
- Component limitations and bugs found (without fixing them if in a documentation-only task)
- Missing prerequisites
- Decisions that need approval (language, Storybook title hierarchy, where MDX pages live)
- What was **NOT** verified
