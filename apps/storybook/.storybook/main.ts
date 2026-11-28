import type { StorybookConfig } from "@storybook/svelte-vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  framework: "@storybook/svelte-vite",
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  // Somente componentes Svelte. Stories ficam neste app e importam os
  // componentes de packages/svelte/src/lib pelo alias "@atlas" (HMR sem build).
  stories: ["../src/**/*.stories.@(ts|js)"],
  viteFinal: async (viteConfig) => {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(svelte() as any);
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "@atlas": fileURLToPath(
        new URL("../../../packages/svelte/src/lib", import.meta.url),
      ),
    };
    return viteConfig;
  },
};

export default config;
