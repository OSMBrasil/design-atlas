import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlLabel.svelte";

const meta = {
  title: "Components/Label",
  component: Component,
  args: {
  "id": "label-demo",
  "label": "Label",
  "description": "",
  "optional": false,
  "required": false,
  "disabled": false
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: {"description":"Texto de apoio"} };
export const Required: Story = { args: {"required":true} };
export const Optional: Story = { args: {"optional":true} };
export const Disabled: Story = { args: {"disabled":true} };
