import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlMenu.svelte";

const meta = {
  title: "Components/Menu",
  component: Component,
  args: {
  "items": [
    {
      "label": "Mapa",
      "href": "#"
    },
    {
      "label": "Notificações",
      "href": "#",
      "badgeNumber": 3
    },
    {
      "label": "Configurações",
      "href": "#",
      "chevron": true
    },
    {
      "label": "Indisponível",
      "href": "#",
      "disabled": true
    }
  ]
},
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

