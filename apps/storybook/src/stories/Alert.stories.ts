import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/AlertWrapper.svelte";

const meta = {
  title: "Components/Alert",
  component: Component,
  args: {
    type: "box",
    state: "info",
    title: true,
    titleText: "Title",
    close: false,
    dismissButtonLabel: "Close",
    fadeIn: false,
    autoDismiss: false,
    message: "A simple primary alert—check it out!",
  },
  argTypes: {
    state: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    type: {
      control: "inline-radio",
      options: ["box", "inline"],
    },
    fadeIn: { control: "boolean" },
    autoDismiss: { control: "boolean" },
    dismissButtonLabel: { control: "text" },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Info: Story = { args: { state: "info" } };
export const Success: Story = { args: { state: "success" } };
export const Warning: Story = { args: { state: "warning" } };
export const Error: Story = { args: { state: "error" } };
export const Inline: Story = { args: { type: "inline", state: "error" } };
export const Closable: Story = { args: { close: true } };
export const FadeIn: Story = { args: { fadeIn: true } };
export const AutoDismiss: Story = { args: { autoDismiss: 4000, close: true } };
