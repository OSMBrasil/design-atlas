import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect } from "storybook/test";
import { tune, layers, refresh, visibilityOff } from "@design-atlas/ms-icons";
import Component from "@atlas/AtlTabs.svelte";

const meta = {
  title: "Components/Tabs",
  component: Component,
  args: {
    ariaLabel: "Tabs navigation",
    items: [
      {
        label: "General",
        href: "#",
        selected: true,
      },
      {
        label: "Layers",
        href: "#",
      },
      {
        label: "History",
        href: "#",
      },
      {
        label: "Disabled",
        href: "#",
        disabled: true,
      },
    ],
  },
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const layersTab = canvas.getByRole("tab", { name: /layers/i });
    const historyTab = canvas.getByRole("tab", { name: /history/i });
    await userEvent.click(layersTab);
    await expect(layersTab).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowRight}");
    await expect(historyTab).toHaveFocus();
  },
};

export const WithIcons: Story = {
  args: {
    ariaLabel: "Tabs navigation",
    items: [
      {
        label: "General",
        href: "#",
        icon: tune,
        selected: true,
      },
      {
        label: "Layers",
        href: "#",
        icon: layers,
      },
      {
        label: "History",
        href: "#",
        icon: refresh,
      },
      {
        label: "Disabled",
        href: "#",
        icon: visibilityOff,
        disabled: true,
      },
    ],
  },
};


