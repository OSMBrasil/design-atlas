import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { publicIcon } from "@design-atlas/ms-icons";
import Component from "@atlas/AtlSelect.svelte";

const meta = {
  title: "Components/Select",
  component: Component,
  args: {
    label: "Country",
    options: ["Brazil", "Argentina", "Chile"],
    placeholder: "Select an option",
    disabled: false,
    required: false,
    optional: false,
    description: "",
    variant: "default",
    visuallyHidden: false,
    isLegend: false,
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    optional: { control: "boolean" },
    visuallyHidden: { control: "boolean" },
    isLegend: { control: "boolean" },
    variant: {
      control: "select",
      options: ["default", "active", "icon"],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Required: Story = { args: { required: true } };
export const WithIcon: Story = {
  args: {
    icon: publicIcon,
    variant: "icon",
  },
};
export const WithDescription: Story = {
  args: {
    description: "Select the country for your regional settings",
  },
};
