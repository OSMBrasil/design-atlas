import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { map, notifications, settings, layers } from "@design-atlas/ms-icons";
import Component from "@atlas/AtlMenu.svelte";

const meta = {
  title: "Components/Menu",
  component: Component,
  args: {
    items: [
      {
        label: "Map",
        href: "#",
      },
      {
        label: "Notifications",
        href: "#",
        badgeNumber: 3,
      },
      {
        label: "Settings",
        href: "#",
        chevron: true,
      },
      {
        label: "Unavailable",
        href: "#",
        disabled: true,
      },
    ],
  },
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIconsAndBadgeCap: Story = {
  args: {
    items: [
      {
        label: "Map",
        href: "#",
        icon: map,
      },
      {
        label: "Notifications",
        href: "#",
        icon: notifications,
        badgeNumber: 120,
      },
      {
        label: "Settings",
        href: "#",
        icon: settings,
        chevron: true,
      },
      {
        label: "Unavailable",
        href: "#",
        icon: layers,
        disabled: true,
      },
    ],
  },
};


