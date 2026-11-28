import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlTextInput.svelte";

const meta = {
  title: "Components/TextInput",
  component: Component,
  args: {
  "placeholder": "Placeholder",
  "value": "",
  "status": "default",
  "disabled": false,
  "readonly": false,
  "clearable": false,
  "inputType": "text"
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
export const Success: Story = { args: {"status":"success"} };
export const Clearable: Story = { args: {"clearable":true,"value":"Texto"} };
export const Disabled: Story = { args: {"disabled":true} };
export const Readonly: Story = { args: {"readonly":true,"value":"Somente leitura"} };
