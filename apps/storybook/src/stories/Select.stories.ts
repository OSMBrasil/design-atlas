import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlSelect.svelte";

const meta = {
  title: "Components/Select",
  component: Component,
  args: {
  "label": "Selecione",
  "options": [
    "Brasil",
    "Argentina",
    "Chile"
  ],
  "placeholder": "Selecione uma opção",
  "disabled": false,
  "required": false,
  "optional": false,
  "description": ""
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: {"disabled":true} };
export const Required: Story = { args: {"required":true} };
