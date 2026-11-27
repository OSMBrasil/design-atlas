import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    // Addon de acessibilidade em modo informativo:
    // exibe os resultados da auditoria (axe-core) no painel "Accessibility"
    // sem falhar/estourar erros nos testes automatizados.
    {
      name: "@storybook/addon-a11y",
      options: {
        test: "skip", // desativa o a11y como "play function" dos testes; apenas informativo na UI
      },
    },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
