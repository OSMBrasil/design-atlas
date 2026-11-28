import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlTextArea.svelte";

const meta = {
  title: "Components/TextArea",
  component: Component,
  args: {
  "label": "Descrição",
  "placeholder": "Escreva aqui",
  "value": "",
  "status": "default",
  "rows": 3,
  "disabled": false,
  "readonly": false,
  "required": false,
  "autosize": false,
  "description": ""
},
  argTypes: {
  "status": {
    "control": "select",
    "options": [
      "default",
      "error",
      "success"
    ]
  }
},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Error: Story = { args: {"status":"error"} };
export const Disabled: Story = { args: {"disabled":true} };
export const Readonly: Story = { args: {"readonly":true,"value":"Somente leitura"} };
