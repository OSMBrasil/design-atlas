import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlField.svelte";

const meta = {
  title: "Components/Field",
  component: Component,
  args: {
  "label": "Nome",
  "labelDescription": "Como aparece no perfil",
  "placeholder": "Digite seu nome",
  "status": "default",
  "alertMessage": "Mensagem de alerta",
  "inlineAlert": false,
  "optional": false,
  "required": false,
  "disabled": false
},
  argTypes: {
  "status": {
    "control": "select",
    "options": [
      "default",
      "error",
      "warning",
      "success"
    ]
  }
},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Required: Story = { args: {"required":true} };
export const WithAlert: Story = { args: {"inlineAlert":true,"status":"error"} };
export const Disabled: Story = { args: {"disabled":true} };
