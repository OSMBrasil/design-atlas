import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "../wrappers/AlertWrapper.svelte";

const meta = {
  title: "Components/Alert",
  component: Component,
  args: {
  "type": "inline",
  "state": "info",
  "title": true,
  "titleText": "Título",
  "close": false,
  "message": "Mensagem do alerta"
},
  argTypes: {
  "state": {
    "control": "select",
    "options": [
      "info",
      "success",
      "warning",
      "error"
    ]
  },
  "type": {
    "control": "inline-radio",
    "options": [
      "inline",
      "banner"
    ]
  }
},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Info: Story = { args: {"state":"info"} };
export const Success: Story = { args: {"state":"success"} };
export const Warning: Story = { args: {"state":"warning"} };
export const Error: Story = { args: {"state":"error"} };
export const Closable: Story = { args: {"close":true} };
