import type { Preview } from "@storybook/svelte-vite";
import { addons } from "storybook/preview-api";
import { themes } from "storybook/theming";
import "@design-atlas/css/atl-style.css";
import "./preview.css";

type Theme = "light" | "dark";

// Applies the Atlas theme only to the area where the component is rendered
// (via data-atl-theme and data-atl-view attributes styled in preview.css),
// ignoring the browser theme and without affecting the Storybook UI/Controls.
const applyTheme = (theme: Theme, viewMode?: string) => {
  const root = document.documentElement;
  root.dataset.atlTheme = theme;
  if (viewMode) root.dataset.atlView = viewMode;
};

// Ensures immediate updates on the Docs tab when toggling the toolbar switch.if (typeof document !== "undefined") {
try {
  const channel = addons.getChannel();
  channel.on("globalsUpdated", ({ globals }: { globals?: { theme?: Theme } }) => {
    if (globals?.theme) applyTheme(globals.theme);
  });
} catch {
  // Channel not yet initialized outside the preview runtime.
}

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
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
    // The background automatically follows the Atlas theme toggle.
    backgrounds: { disabled: true },
    a11y: {
      // 'todo' = informational: displays violations in the panel without failing anything.
      test: "todo",
    },
  },
};

export default preview;
