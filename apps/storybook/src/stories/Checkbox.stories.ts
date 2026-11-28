import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect } from "storybook/test";
import Component from "../wrappers/CheckboxWrapper.svelte";

const meta = {
  title: "Components/Checkbox",
  component: Component,
  args: {
    label: "I accept the terms",
    checked: false,
    indeterminate: false,
    disabled: false,
    error: false,
    description: "",
  },
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: /i accept the terms/i });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { error: true } };
export const WithDescription: Story = {
  args: {
    label: "Receive email updates",
    description: "We will only notify you about important changes.",
  },
};
