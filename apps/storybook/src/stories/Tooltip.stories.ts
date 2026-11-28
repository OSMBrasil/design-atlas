import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/TooltipWrapper.svelte";

const meta = {
  title: "Components/Tooltip",
  component: Component,
  args: {
    text: "Tooltip text",
    direction: "bottom",
    trigger: "Hover me",
  },
  argTypes: {
    text: { control: "text" },
    trigger: { control: "text" },
    direction: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Top: Story = { args: { direction: "top" } };
export const Right: Story = { args: { direction: "right" } };
export const Left: Story = { args: { direction: "left" } };
export const LongText: Story = {
  args: {
    text: "This is a longer tooltip description that wraps cleanly across multiple lines when it exceeds the maximum width.",
  },
};
