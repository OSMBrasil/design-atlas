import type { StorybookConfig } from "@storybook/svelte-vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  framework: "@storybook/svelte-vite",
  addons: [
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    "@storybook/addon-svelte-csf",
    "@storybook/addon-vitest",
  ],
  // Svelte components only. Stories live in this app and import
  // components from packages/svelte/src/lib via the "@atlas" alias (HMR without build).
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|js|svelte)"],
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
