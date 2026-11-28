import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/ButtonGroupWrapper.svelte";

const meta = {
  title: "Components/ButtonGroup",
  component: Component,
  args: {
  "labels": [
    "Primeiro",
    "Segundo",
    "Terceiro"
  ]
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

