import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlRadio.svelte";

const meta = {
  title: "Components/Radio",
  component: Component,
  args: {
  "label": "Escolha uma opção",
  "name": "radio-demo",
  "value": "a",
  "options": [
    {
      "key": "a",
      "text": "Opção A"
    },
    {
      "key": "b",
      "text": "Opção B"
    },
    {
      "key": "c",
      "text": "Opção C",
      "disabled": true
    }
  ],
  "disabled": false,
  "required": false,
  "description": ""
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: {"disabled":true} };
