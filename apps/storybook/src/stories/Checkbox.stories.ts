import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/CheckboxWrapper.svelte";

const meta = {
  title: "Components/Checkbox",
  component: Component,
  args: {
  "label": "Aceito os termos",
  "checked": false,
  "error": false
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: {"checked":true} };
export const Error: Story = { args: {"error":true} };
