import type { StorybookConfig } from "storybook";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

/**
 * Storybook 10 — configuração multi-framework (React + Svelte 5) via Vite.
 *
 * - `stories` aponta para os pacotes do workspace, mantendo as stories
 *   co-localizadas junto de cada componente (configuração modular: para
 *   adicionar um novo pacote/framework, basta somar uma entrada aqui).
 * - Os frameworks `@storybook/react-vite` e `@storybook/svelte-vite` são
 *   registrados como "adapters" no `viteFinal`, pois o core suporta apenas
 *   um framework primário por instância (aqui, React). As stories .svelte
 *   são compiladas pelo plugin do Svelte e transformadas em CSF pelo
 *   adapter do svelte-vite.
 */
const config: StorybookConfig = {
  // Framework primário: React (histórico/CSF3 + docgen via react-vite)
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  addons: ["@storybook/addon-a11y"],

  // Stories co-localizadas nos pacotes + stories locais deste app.
  stories: [
    "../src/**/*.stories.@(ts|tsx|svelte|mdx)",
    "../../packages/react/src/**/*.stories.@(ts|tsx)",
    "../../packages/svelte/src/**/*.stories.@(svelte|ts)",
  ],

  docs: {
    autodocs: true,
  },

  viteFinal: async (viteConfig) => {
    viteConfig.plugins ??= [];

    // Adapter Svelte 5 (compila *.svelte e registra stories .svelte como CSF)
    viteConfig.plugins.push(
      svelte({
        configFile: false,
        compilerOptions: { experimentalAutosave: false },
      }) as any,
    );
    const { svelteViteAdapter } = await import("@storybook/svelte-vite");
    viteConfig.plugins.push(svelteViteAdapter() as any);

    // Adapter React (preserva o comportamento padrão do react-vite:
    // docgen-typescript etc.)
    viteConfig.plugins.push(react() as any);
    const { reactViteAdapter } = await import("@storybook/react-vite");
    viteConfig.plugins.push(reactViteAdapter() as any);

    viteConfig.resolve ??= {};
    viteConfig.resolve.dedupe = [
      ...(viteConfig.resolve.dedupe ?? []),
      "react",
      "react-dom",
      "svelte",
    ];
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      // Consome o código-fonte dos pacotes (HMR nas stories sem rebuild):
      "@design-atlas/svelte": fileURLToPath(
        new URL("../../../packages/svelte/src/index.ts", import.meta.url),
      ),
      "@design-atlas/react": fileURLToPath(
        new URL("../../../packages/react/src/index.ts", import.meta.url),
      ),
    };

    return viteConfig;
  },
};

export default config;
