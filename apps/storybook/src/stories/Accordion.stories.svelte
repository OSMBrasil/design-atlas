<script module lang="ts">
  import type { ComponentProps } from "svelte";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import AtlAccordion from "@atlas/Accordion/AtlAccordion.svelte";
  import AtlAccordionItem from "@atlas/Accordion/AtlAccordionItem.svelte";
  import AtlButton from "@atlas/AtlButton.svelte";
  import AtlCheckbox from "@atlas/AtlCheckbox.svelte";

  const { Story } = defineMeta({
    title: "Components/Accordion",
    component: AtlAccordion,
    tags: ["!autodocs"],
    render: template,
    args: {
      align: "end",
      outline: true,
      disabled: false,
      type: "multiple",
    },
    argTypes: {
      align: {
        control: "inline-radio",
        options: ["start", "end"],
        description: "Placement of the chevron icon inside each heading.",
        table: { category: "Appearance" },
      },
      outline: {
        control: "boolean",
        description:
          "Displays the outer border and rounded corners. Set to false to remove the outer border while preserving internal spacing.",
        table: { category: "Appearance" },
      },
      type: {
        control: "inline-radio",
        options: ["multiple", "single"],
        description:
          "Controls whether multiple items can stay open or only one at a time.",
        table: { category: "Behavior" },
      },
      disabled: {
        control: "boolean",
        description: "Disables all accordion items.",
        table: { category: "State" },
      },
    },
  });
</script>

<script lang="ts">
  let notifications = $state(false);
  let saved = $state(false);
</script>

{#snippet template(args: ComponentProps<typeof AtlAccordion>)}
  <AtlAccordion {...args}>
    <AtlAccordionItem title="Heading Accordion">
      <p>
        An Accordion is an expandable and collapsible section of content, often
        featured in a vertically stacked list with other Accordions.
      </p>
    </AtlAccordionItem>
    <AtlAccordionItem title="When to use">
      <p>
        Use the Accordion component when you need to organize blocks of content
        into sections. Avoid using it when the user needs to read the content by
        default.
      </p>
    </AtlAccordionItem>
    <AtlAccordionItem title="Content guidelines">
      <p>
        Expanded content can include paragraph text, links, images, videos,
        tables, or form items.
      </p>
    </AtlAccordionItem>
  </AtlAccordion>
{/snippet}

<Story
  name="BasicUsage"
  parameters={{
    docs: {
      description: {
        story:
          'Default multi-section accordion (`type="multiple"`). Any number of sections can stay expanded simultaneously, and arrow keys move focus across headings.',
      },
    },
  }}
  play={async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("button", { name: /heading accordion/i });
    const second = canvas.getByRole("button", { name: /when to use/i });
    const third = canvas.getByRole("button", { name: /content guidelines/i });

    await expect(first).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(first);
    await expect(first).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "true");

    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(second).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(third).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(first).toHaveFocus();
  }}
/>

<Story
  name="SingleMode"
  args={{ type: "single" }}
  parameters={{
    docs: {
      description: {
        story:
          'Single-expansion mode (`type="single"`): opening one section automatically collapses any other expanded section.',
      },
    },
  }}
  play={async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("button", { name: /heading accordion/i });
    const second = canvas.getByRole("button", { name: /when to use/i });

    await userEvent.click(first);
    await expect(first).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  }}
/>

<Story
  name="SingleItem"
  parameters={{
    docs: {
      description: {
        story:
          "Accordion containing only a single expandable section (rendered without internal dividers).",
      },
    },
  }}
>
  {#snippet template(args)}
    <AtlAccordion {...args}>
      <AtlAccordionItem title="Single section">
        <p>Accordion with only one expandable section (no dividers).</p>
      </AtlAccordionItem>
    </AtlAccordion>
  {/snippet}
</Story>

<Story
  name="AlignStart"
  args={{ align: "start" }}
  parameters={{
    docs: {
      description: {
        story:
          'Places the chevron icon at the inline start of each heading (`align="start"`), adapting automatically in RTL layouts.',
      },
    },
  }}
/>

<Story
  name="NoOutline"
  args={{ outline: false }}
  parameters={{
    docs: {
      description: {
        story:
          'Removes the outer border and corner radius (`outline={false}`) while keeping internal horizontal padding and section dividers.',
      },
    },
  }}
/>

<Story
  name="Disabled"
  args={{ disabled: true }}
  parameters={{
    docs: {
      description: {
        story:
          "Disables all sections at once via the parent `disabled` prop without losing individual item states.",
      },
    },
  }}
/>

<Story
  name="DisabledItemKeyboardSkip"
  parameters={{
    docs: {
      description: {
        story:
          "Individual items can be disabled via `disabled` on `<AtlAccordionItem>`. Keyboard roving focus (`ArrowDown` / `ArrowUp`) automatically skips disabled headings.",
      },
    },
  }}
  play={async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("button", { name: /section 1/i });
    const disabledBtn = canvas.getByRole("button", {
      name: /disabled section/i,
    });
    const third = canvas.getByRole("button", { name: /section 3/i });

    await expect(disabledBtn).toBeDisabled();
    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(third).toHaveFocus();
  }}
>
  {#snippet template(args)}
    <AtlAccordion {...args}>
      <AtlAccordionItem title="Section 1">
        <p>Content for the first section.</p>
      </AtlAccordionItem>
      <AtlAccordionItem title="Disabled section" disabled>
        <p>This section cannot be expanded.</p>
      </AtlAccordionItem>
      <AtlAccordionItem title="Section 3">
        <p>Content for the third section.</p>
      </AtlAccordionItem>
    </AtlAccordion>
  {/snippet}
</Story>

<Story
  name="WithComponents"
  args={{ type: "single" }}
  parameters={{
    docs: {
      description: {
        story:
          "Composing interactive Design Atlas components (`AtlCheckbox`, `AtlButton`, form inputs) directly inside `<AtlAccordionItem>` slots with full Svelte reactivity.",
      },
    },
  }}
  play={async ({ canvas, userEvent }) => {
    const firstTrigger = canvas.getByRole("button", {
      name: /account preferences/i,
    });
    const secondTrigger = canvas.getByRole("button", {
      name: /advanced settings/i,
    });

    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    const checkbox = canvas.getByRole("checkbox", {
      name: /receive email notifications/i,
    });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    await userEvent.click(secondTrigger);
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  }}
>
  {#snippet template(args)}
    <AtlAccordion {...args}>
      <AtlAccordionItem title="Account preferences" open>
        <div
          style="display: flex; flex-direction: column; gap: 12px; padding: 8px 0;"
        >
          <AtlCheckbox bind:checked={notifications}>
            Receive email notifications
          </AtlCheckbox>
          <div>
            <AtlButton on:click={() => (saved = true)}>
              {saved ? "Saved" : "Save preferences"}
            </AtlButton>
          </div>
        </div>
      </AtlAccordionItem>
      <AtlAccordionItem title="Advanced settings">
        <p>
          Custom Svelte components can be placed directly inside each accordion
          item.
        </p>
      </AtlAccordionItem>
    </AtlAccordion>
  {/snippet}
</Story>
