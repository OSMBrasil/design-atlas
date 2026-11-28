import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlToggleSwitch.svelte";

const meta = {
  title: "Components/ToggleSwitch",
  component: Component,
  args: {
    label: "Notifications",
    description: "Receive email alerts",
    value: "on",
    disabled: false,
    visuallyHidden: false,
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    value: {
      control: "select",
      options: ["on", "off"],
    },
    disabled: { control: "boolean" },
    visuallyHidden: { control: "boolean" },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Off: Story = { args: { value: "off" } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOff: Story = { args: { value: "off", disabled: true } };
export const WithoutDescription: Story = { args: { description: "" } };
