import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlAccordion.svelte";

const meta = {
  title: "Components/Accordion",
  component: Component,
  args: {
  "items": [
    {
      "label": "Primeiro item",
      "content": "Conteúdo do primeiro item."
    },
    {
      "label": "Segundo item",
      "content": "Conteúdo do segundo item."
    },
    {
      "label": "Terceiro item",
      "content": "Conteúdo do terceiro item."
    }
  ]
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

