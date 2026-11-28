import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlRadio.svelte";

const meta = {
  title: "Components/Radio",
  component: Component,
  args: {
    label: "Choose an option",
    name: "radio-demo",
    value: "a",
    options: [
      {
        key: "a",
        text: "Option A",
      },
      {
        key: "b",
        text: "Option B",
      },
      {
        key: "c",
        text: "Option C",
        disabled: true,
      },
    ],
    disabled: false,
    required: false,
    description: "",
  },
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const WithDescription: Story = {
  args: {
    label: "Notification frequency",
    name: "radio-description-demo",
    value: "daily",
    description: "Choose how often you want to receive summaries.",
    options: [
      {
        key: "daily",
        text: "Daily",
        description: "A digest sent every morning.",
      },
      {
        key: "weekly",
        text: "Weekly",
        description: "A single summary on Mondays.",
      },
    ],
  },
};
