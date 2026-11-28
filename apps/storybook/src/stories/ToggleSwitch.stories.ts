import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlToggleSwitch.svelte";

const meta = {
  title: "Components/ToggleSwitch",
  component: Component,
  args: {
  "label": "Notificações",
  "description": "Receber avisos por e-mail",
  "disabled": false
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: {"disabled":true} };
