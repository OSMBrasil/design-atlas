import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect } from "storybook/test";
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

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};
export const Off: Story = { args: { value: "off" } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOff: Story = { args: { value: "off", disabled: true } };
export const WithoutDescription: Story = { args: { description: "" } };
