# `@design-atlas/ms-icons`

Self-contained Material Symbols (**Rounded**, weight **400**, optical size **24**, grade **0**) SVG icon package for **Design Atlas** — zero runtime network requests.

## Adding an Icon / Como adicionar um ícone

1. Add the Material Symbols name, `fills` (`[0]` or `[0, 1]`), and `rtlMirror` flag to `icons.config.json`.
2. Run `pnpm icons:sync` from the repository root (offline, reads from `node_modules`).
3. Review the generated SVG in `svg/synced/` and open your PR. CI runs `pnpm icons:check` to prevent manual edits.

> **PT-BR:** Para adicionar um ícone, inclua o nome em `icons.config.json`, rode `pnpm icons:sync` na raiz do repositório e revise o SVG gerado em `svg/synced/` no PR. Não edite `svg/synced/` à mão; ícones próprios do OSM vão em `svg/manual/`.

## Usage / Uso

```js
import { info, renderIcon } from "@design-atlas/ms-icons";

// Decorative icon (default: aria-hidden="true", focusable="false", 1.5rem)
const decorative = renderIcon(info);

// Informative icon (role="img", aria-label)
const informative = renderIcon(info, { label: "More information", size: "1.25rem" });
```

Individual SVGs are exported via `@design-atlas/ms-icons/svg/<name>.svg` and the combined sprite via `@design-atlas/ms-icons/sprite.svg`.

## Accessibility / Acessibilidade

- **Decorative vs. informative:** Icons are decorative by default (`aria-hidden="true"`, `focusable="false"`). Pass `{ label }` only when the icon conveys standalone meaning (`role="img"` + `aria-label`).
- **Icon-only buttons:** Put `aria-label` on the `<button>`, **not** on the `<svg>`, keeping the icon decorative.
- **Contrast:** Informative icons must meet at least **3:1** non-text contrast (WCAG 2.1 AA).
- **Target size:** Interactive icon controls should have a minimum **24×24px** target area (48×48px recommended for touch).
- **RTL mirroring:** Mirror horizontal directional icons (`rtlMirror: true`, e.g. `arrow_back`, `arrow_forward`, `chevron_right`) in RTL layouts; do **not** mirror non-directional icons (`check`, `info`, `warning`).
- **Motion:** Respect `@media (prefers-reduced-motion: reduce)` for any animated icons.

## License & Attribution / Licença e Atribuição

- Package code: **MIT** (`LICENSE`).
- Material Symbols SVGs: **Apache-2.0** (`LICENSE-ICONS`), © Google LLC, sourced via `@material-symbols/svg-400`.
