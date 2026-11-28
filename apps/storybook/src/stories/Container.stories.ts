import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/ContainerWrapper.svelte";

const meta = {
  title: "Components/Container",
  component: Component,
  args: {
  "content": "Conteúdo do container",
  "size": "md",
  "variant": "default"
},
  argTypes: {
  "size": {
    "control": "inline-radio",
    "options": [
      "sm",
      "md",
      "lg",
      "xl"
    ]
  },
  "variant": {
    "control": "inline-radio",
    "options": [
      "default",
      "close",
      "sheet"
    ]
  }
},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Closable: Story = { args: {"variant":"close"} };
export const Sheet: Story = { args: {"variant":"sheet"} };
export const Large: Story = { args: {"size":"lg"} };
