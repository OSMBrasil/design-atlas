import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/LinkWrapper.svelte";

const meta = {
  title: "Components/Link",
  component: Component,
  args: {
  "label": "Link de exemplo",
  "href": "#",
  "variant": "underline",
  "external": false
},
  argTypes: {
  "variant": {
    "control": "inline-radio",
    "options": [
      "underline",
      "basic"
    ]
  }
},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Basic: Story = { args: {"variant":"basic"} };
export const External: Story = { args: {"external":true,"href":"https://www.openstreetmap.org"} };
