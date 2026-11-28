import type { Preview } from "@storybook/svelte-vite";
import { addons } from "storybook/preview-api";
import { themes } from "storybook/theming";
import "@design-atlas/css/atl-style.css";
import "./preview.css";

type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

// Apply Atlas theme and text direction strictly to the component preview area
// (via data-atl-theme, data-atl-view, and dir on .docs-story / #storybook-root),
// keeping Storybook's own Docs & Controls UI unaffected.
const applyPreviewState = (
  theme?: Theme,
  direction?: Direction,
  viewMode?: string,
) => {
  const root = document.documentElement;
  if (theme) root.dataset.atlTheme = theme;
  if (viewMode) root.dataset.atlView = viewMode;
  if (direction) {
    root.dataset.atlDir = direction;
    const storyRoot = document.getElementById("storybook-root");
    if (storyRoot) storyRoot.setAttribute("dir", direction);
    document
      .querySelectorAll(".docs-story")
      .forEach((el) => el.setAttribute("dir", direction));
  }
};

// Keep Docs view immediately synchronized when toolbar globals change.
if (typeof document !== "undefined") {
  try {
    const channel = addons.getChannel();
    channel.on(
      "globalsUpdated",
      ({ globals }: { globals?: { theme?: Theme; direction?: Direction } }) => {
        applyPreviewState(globals?.theme, globals?.direction);
      },
    );
  } catch {
    // Channel not initialized outside preview runtime.
  }
}

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Atlas Theme",
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
    direction: {
      description: "Text direction (LTR / RTL)",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", direction: "ltr" },
  decorators: [
    (story, context) => {
      applyPreviewState(
        (context.globals.theme as Theme) ?? "light",
        (context.globals.direction as Direction) ?? "ltr",
        context.viewMode,
      );
      return story();
    },
  ],
  parameters: {
    docs: {
      theme: themes.dark,
    },
    backgrounds: { disabled: true },
    a11y: {
      // 'todo' = informative mode: shows violations in panel without failing.
      test: "todo",
    },
  },
};

export default preview;
