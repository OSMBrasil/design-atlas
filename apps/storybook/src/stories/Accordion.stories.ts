import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "@atlas/AtlAccordion.svelte";

const meta = {
  title: "Components/Accordion",
  component: Component,
  args: {
    items: [
      {
        label: "Heading Accordion",
        content:
          "<p>An Accordion is an expandable and collapsible section of content, often featured in a vertically stacked list with other Accordions.</p>",
      },
      {
        label: "When to use",
        content:
          "<p>Use the Accordion component when you need to organize blocks of content into sections. Avoid using it when the user needs to read the content by default.</p>",
      },
      {
        label: "Content guidelines",
        content:
          "<p>Expanded content can include paragraph text, links, images, videos, tables, or form items.</p>",
      },
    ],
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of `{ label: string, content: string }` items",
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRichContent: Story = {
  args: {
    items: [
      {
        label: "Paragraphs and links",
        content:
          '<p>Expanded Accordion content can be as long as needed. Learn more in the <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">OpenStreetMap</a> documentation.</p>',
      },
      {
        label: "Sub-headers and lists",
        content:
          "<h6>Guidelines</h6><ul><li>Use sub-headers to represent different subsections.</li><li>Avoid nesting additional Accordions inside an item.</li></ul>",
      },
      {
        label: "Tables",
        content:
          "<table><thead><tr><th>Token</th><th>Usage</th></tr></thead><tbody><tr><td>--bgn-surface</td><td>Accordion background</td></tr><tr><td>--border-color-subtle</td><td>Outer border &amp; dividers</td></tr></tbody></table>",
      },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { label: "First item", content: "Content for the first item." },
      { label: "Second item", content: "Content for the second item." },
      { label: "Third item", content: "Content for the third item." },
      { label: "Fourth item", content: "Content for the fourth item." },
      { label: "Fifth item", content: "Content for the fifth item." },
      { label: "Sixth item", content: "Content for the sixth item." },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        label: "Single section",
        content: "Accordion with only one expandable section (no dividers).",
      },
    ],
  },
};

