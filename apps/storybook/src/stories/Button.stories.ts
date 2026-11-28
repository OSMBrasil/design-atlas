import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/ButtonWrapper.svelte";

const meta = {
  title: "Components/Button",
  component: Component,
  args: {
  "label": "Button",
  "variant": "",
  "disabled": false,
  "withIcon": false
},
  argTypes: {
  "variant": {
    "control": "select",
    "options": [
      "",
      "danger",
      "tertiary",
      "outline"
    ]
  }
},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Danger: Story = { args: {"variant":"danger"} };
export const Tertiary: Story = { args: {"variant":"tertiary"} };
export const Outline: Story = { args: {"variant":"outline"} };
export const Disabled: Story = { args: {"disabled":true} };
