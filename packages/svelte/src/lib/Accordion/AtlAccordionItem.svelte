<!--
  @component
  Subcomponent of `AtlAccordion` representing a single expandable/collapsible section.
  Must be rendered inside `<AtlAccordion>`. Use the `title` prop or `title` named slot
  for the heading, and the default slot for arbitrary panel content or components.
-->
<script lang="ts">
    import { createEventDispatcher, getContext, onMount } from "svelte";
    import { get, type Writable } from "svelte/store";
    import { keyboardArrowDown, keyboardArrowUp } from "@design-atlas/ms-icons";
    import AtlIcon from "../AtlIcon.svelte";
    import { splitAriaNaming } from "../utils/aria-naming.js";
    import { useId } from "../utils/id-scope.js";

    interface AtlAccordionContext {
        disableItems: Writable<boolean>;
        openId: Writable<object | null>;
        typeStore: Writable<"single" | "multiple">;
        notifyOpen: (itemKey: object) => void;
        claimSingle: (itemKey: object) => boolean;
        isMounted: () => boolean;
    }

    /**
     * Heading text displayed inside the trigger button.
     * Alternatively, provide custom heading content via the `"title"` slot.
     */
    export let title: string | undefined = undefined;

    /**
     * Controls whether this accordion item is expanded. Supports `bind:open`.
     */
    export let open: boolean = false;

    /**
     * Disables interaction for this accordion item.
     */
    export let disabled: boolean = false;

    /**
     * Accessible label for the heading button when no visible title is provided.
     * An explicit `aria-label` attribute passed via rest props takes precedence.
     */
    export let ariaLabel: string | undefined = undefined;

    /**
     * Reference to the underlying heading `<button>` element. Supports `bind:ref`.
     */
    export let ref: HTMLButtonElement | null = null;

    /**
     * Identifier for the `<li>` element. Heading and content IDs derive from it
     * as `{id}-button` and `{id}-content`.
     */
    export let id: string = useId("accordion-item");

    const dispatch = createEventDispatcher<{ toggle: { open: boolean } }>();

    const ctx = getContext<AtlAccordionContext | undefined>("atl-accordion");
    const disableItems = ctx?.disableItems;

    const itemKey = {};

    let claimOnMount = Boolean(open && ctx?.isMounted());

    const unsubscribeOpenId = ctx
        ? ctx.openId.subscribe((openItemId) => {
              if (claimOnMount) {
                  claimOnMount = false;
                  return;
              }
              if (openItemId !== null && openItemId !== itemKey) {
                  open = false;
              }
          })
        : () => {};

    $: ({
        ariaLabel: restAriaLabel,
        ariaLabelledBy,
        ariaDescribedBy,
        rest: wrapperProps,
    } = splitAriaNaming($$restProps));

    $: isDisabled = disabled || Boolean(disableItems && $disableItems);

    $: if (isDisabled && open) {
        open = false;
    }

    $: if (open && ctx) {
        ctx.notifyOpen(itemKey);
    }

    let previousType = ctx ? get(ctx.typeStore) : "multiple";

    const unsubscribeType = ctx
        ? ctx.typeStore.subscribe((value) => {
              if (
                  value === "single" &&
                  previousType !== "single" &&
                  open &&
                  !ctx.claimSingle(itemKey)
              ) {
                  open = false;
              }
              previousType = value;
          })
        : () => {};

    onMount(() => {
        if (!ctx && typeof console !== "undefined") {
            console.warn(
                "[Design Atlas] `AtlAccordionItem` is a subcomponent of `AtlAccordion` and should be rendered inside `<AtlAccordion>`.",
            );
        }
        return () => {
            if (ctx && get(ctx.openId) === itemKey) {
                ctx.openId.set(null);
            }
            unsubscribeOpenId();
            unsubscribeType();
        };
    });

    function handleToggle() {
        if (isDisabled) return;
        open = !open;
        dispatch("toggle", { open });
    }
</script>

<li
    {id}
    class="atl-accordion__item"
    class:atl-accordion__item--active={open}
    class:atl-accordion__item--disabled={isDisabled}
    {...wrapperProps}
    on:animationend
>
    <button
        bind:this={ref}
        id="{id}-button"
        type="button"
        class="atl-accordion__heading"
        aria-label={restAriaLabel ?? ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-expanded={open}
        aria-controls="{id}-content"
        disabled={isDisabled}
        on:click
        on:click={handleToggle}
        on:mouseover
        on:mouseenter
        on:mouseleave
        on:focus
        on:blur
        on:keydown
    >
        <div class="atl-accordion__title label">
            <slot name="title">{title ?? ""}</slot>
        </div>
        <span class="atl-accordion__chevron color-base" aria-hidden="true">
            <AtlIcon
                icon={open ? keyboardArrowUp : keyboardArrowDown}
                size="var(--size-24)"
            />
        </span>
    </button>

    <div
        id="{id}-content"
        class="atl-accordion__content body-md color-base"
        hidden={!open}
        role={open ? "region" : undefined}
        aria-labelledby={open ? `${id}-button` : undefined}
    >
        <slot />
    </div>
</li>

<style>
    .atl-accordion__item {
        &:not(:last-child) {
            border-bottom: var(--border-width-04, 0.4px) solid
                var(--border-color-subtle);
        }
    }

    :global(.atl-accordion--outline)
        .atl-accordion__item:first-child
        > .atl-accordion__heading {
        border-start-start-radius: calc(var(--border-radius-8) - 1px);
        border-start-end-radius: calc(var(--border-radius-8) - 1px);
    }

    :global(.atl-accordion--outline)
        .atl-accordion__item:last-child:not(.atl-accordion__item--active)
        > .atl-accordion__heading {
        border-end-start-radius: calc(var(--border-radius-8) - 1px);
        border-end-end-radius: calc(var(--border-radius-8) - 1px);
    }

    .atl-accordion__heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-8);
        width: 100%;
        text-align: start;
        padding: var(--spacing-16);
        border: none;
        background: transparent;
        color: var(--color-base);
        cursor: pointer;

        &:hover:not(:disabled) {
            background-color: var(--bgn-surface-hover);
        }

        &:focus-visible {
            outline: 2px solid var(--border-color-focus);
            outline-offset: -2px;
        }

        &:disabled {
            color: var(--color-disable);
            cursor: var(--cursor-disable);
        }
    }

    :global(.atl-accordion--start) .atl-accordion__heading {
        flex-direction: row-reverse;
        justify-content: flex-end;
    }

    .atl-accordion__title {
        font-weight: 600;
        flex: 1;
    }

    .atl-accordion__chevron {
        display: inline-flex;
        flex-shrink: 0;
    }

    .atl-accordion__item--disabled .atl-accordion__chevron {
        color: var(--color-disable);
    }

    .atl-accordion__content {
        padding: var(--spacing-8) var(--spacing-16);
        border-top: var(--border-width-04, 0.4px) solid
            var(--border-color-subtle);

        &[hidden] {
            display: none;
        }
    }
</style>
