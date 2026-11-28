import type { Preview } from "@storybook/svelte-vite";
import { addons } from "storybook/preview-api";
import { themes } from "storybook/theming";
import "@design-atlas/css/atl-style.css";
import "./preview.css";

type Theme = "light" | "dark";

// Aplica o tema do Atlas apenas à área onde o componente é renderizado
// (via atributos data-atl-theme e data-atl-view estilizados em preview.css),
// ignorando o tema do navegador e sem afetar a UI/Controls do Storybook.
const applyTheme = (theme: Theme, viewMode?: string) => {
  const root = document.documentElement;
  root.dataset.atlTheme = theme;
  if (viewMode) root.dataset.atlView = viewMode;
};

// Garante atualização imediata na aba Docs ao alternar o toggle da toolbar.
if (typeof document !== "undefined") {
  try {
    const channel = addons.getChannel();
    channel.on("globalsUpdated", ({ globals }: { globals?: { theme?: Theme } }) => {
      if (globals?.theme) applyTheme(globals.theme);
    });
  } catch {
    // Canal ainda não inicializado fora do runtime do preview.
  }
}

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Tema do Atlas",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Claro" },
          { value: "dark", icon: "moon", title: "Escuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (story, context) => {
      applyTheme(
        (context.globals.theme as Theme) ?? "light",
        context.viewMode,
      );
      return story();
    },
  ],
  parameters: {
    docs: {
      theme: themes.dark,
    },
    // O background acompanha automaticamente o toggle de tema do Atlas.
    backgrounds: { disabled: true },
    a11y: {
      // 'todo' = informativo: mostra violações no painel, sem falhar nada.
      test: "todo",
    },
  },
};

export default preview;
