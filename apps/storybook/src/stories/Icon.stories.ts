import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlIcon.svelte";

const meta = {
  title: "Components/Icon",
  component: Component,
  args: {
    icon: "info-fill",
    size: "1.5rem",
    label: "",
  },
  argTypes: {
    icon: {
      control: "select",
      options: [
        "info",
        "info-fill",
        "check_circle",
        "check_circle-fill",
        "warning",
        "warning-fill",
        "report",
        "report-fill",
        "close",
        "person",
        "keyboard_arrow_down",
        "keyboard_arrow_up",
        "chevron_right",
        "arrow_forward",
        "arrow_back",
        "open_in_new",
        "map",
        "location_on",
        "layers",
      ],
    },
    size: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DirectionalRTL: Story = { args: { icon: "arrow_forward" } };
export const Informative: Story = { args: { icon: "warning-fill", label: "Warning" } };
