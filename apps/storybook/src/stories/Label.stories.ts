import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlLabel.svelte";

const meta = {
  title: "Components/Label",
  component: Component,
  args: {
    inputId: "label-demo",
    label: "Label",
    description: "",
    optional: false,
    required: false,
    disabled: false,
    isLegend: false,
    visuallyHidden: false,
  },
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = {
  args: { description: "Supporting helper text" },
};
export const Required: Story = { args: { required: true } };
export const Optional: Story = { args: { optional: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Legend: Story = {
  args: {
    isLegend: true,
    label: "Fieldset legend",
    description: "Rendered as a legend element",
  },
};
export const VisuallyHidden: Story = {
  args: {
    visuallyHidden: true,
    label: "Screen-reader only label",
    description: "Hidden visually while remaining accessible",
  },
};
