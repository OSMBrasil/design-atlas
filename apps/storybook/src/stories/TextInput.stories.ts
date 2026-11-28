import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlTextInput.svelte";

const meta = {
  title: "Components/TextInput",
  component: Component,
  args: {
    placeholder: "Placeholder",
    value: "",
    status: "default",
    disabled: false,
    readonly: false,
    clearable: false,
    inputType: "text",
    startIcon: "",
    endIcon: "",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["default", "error", "success"],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: { status: "error" } };
export const Success: Story = { args: { status: "success" } };
export const Clearable: Story = {
  args: { clearable: true, value: "Sample text" },
};
export const WithIcons: Story = {
  args: {
    startIcon: "person",
    endIcon: "info",
    placeholder: "Username",
  },
};
export const ClearableWithEndIcon: Story = {
  args: {
    startIcon: "person",
    endIcon: "info",
    clearable: true,
    value: "OpenStreetMap",
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Readonly: Story = {
  args: { readonly: true, value: "Read-only value" },
};
