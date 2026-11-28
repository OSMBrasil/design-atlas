import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlField.svelte";

const meta = {
  title: "Components/Field",
  component: Component,
  args: {
    label: "Name",
    labelDescription: "As shown on your profile",
    placeholder: "Enter your name",
    status: "default",
    alertMessage: "Alert message",
    inlineAlert: false,
    optional: false,
    required: false,
    disabled: false,
    isFieldset: false,
  },
  argTypes: {
    status: {
      control: "select",
      options: ["default", "error", "warning", "success"],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const Optional: Story = { args: { optional: true } };
export const Fieldset: Story = {
  args: {
    isFieldset: true,
    label: "Profile details",
    labelDescription: "Grouped inside a fieldset legend",
  },
};
export const WithAlert: Story = {
  args: {
    inlineAlert: true,
    status: "error",
    alertMessage: "This field is required.",
  },
};
export const Warning: Story = {
  args: {
    inlineAlert: true,
    status: "warning",
    alertMessage: "Double-check this value before continuing.",
  },
};
export const Success: Story = {
  args: {
    inlineAlert: true,
    status: "success",
    alertMessage: "Looks good!",
  },
};
export const Disabled: Story = { args: { disabled: true } };
