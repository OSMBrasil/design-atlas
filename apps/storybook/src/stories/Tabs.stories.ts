import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlTabs.svelte";

const meta = {
  title: "Components/Tabs",
  component: Component,
  args: {
  "ariaLabel": "Navegação por abas",
  "items": [
    {
      "label": "Geral",
      "href": "#",
      "selected": true
    },
    {
      "label": "Camadas",
      "href": "#"
    },
    {
      "label": "Histórico",
      "href": "#"
    },
    {
      "label": "Desativada",
      "href": "#",
      "disabled": true
    }
  ]
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

