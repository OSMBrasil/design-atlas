import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { download } from "@design-atlas/ms-icons";
import Component from "../wrappers/LinkWrapper.svelte";

const meta = {
  title: "Components/Link",
  component: Component,
  args: {
    label: "Example link",
    href: "#",
    variant: "underline",
    size: "md",
    external: false,
    leftIcon: false,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["underline", "basic"],
    },
    size: {
      control: "inline-radio",
      options: ["md", "sm"],
    },
    external: {
      control: "boolean",
    },
    leftIcon: {
      control: "boolean",
    },
    externalLabel: {
      control: "text",
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Basic: Story = { args: { variant: "basic" } };
export const Small: Story = { args: { size: "sm", label: "Small link" } };
export const External: Story = {
  args: {
    external: true,
    href: "https://www.openstreetmap.org",
    label: "OpenStreetMap",
  },
};
export const WithIcon: Story = {
  args: {
    icon: download,
    leftIcon: true,
    label: "Download map data",
  },
};

