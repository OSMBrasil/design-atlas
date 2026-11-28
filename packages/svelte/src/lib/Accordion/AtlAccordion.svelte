<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { get, writable, type Writable } from "svelte/store";
    import { createIdScope } from "../utils/id-scope.js";
    import { rovingFocus } from "../utils/roving-focus.js";

    /**
     * Placement of the chevron icon inside each accordion heading.
     * @type {"start" | "end"}
     */
    export let align: "start" | "end" = "end";

    /**
     * Displays the outer border and rounded corners around the accordion container.
     * Set to `false` to remove the outer border while preserving internal spacing.
     */
    export let outline: boolean = true;

    /**
     * Disables all child `AtlAccordionItem` headings without overwriting each
     * item's own `disabled` prop.
     */
    export let disabled: boolean = false;

    /**
     * Expansion mode for child items.
     * - `"multiple"`: any number of items can be expanded simultaneously.
     * - `"single"`: opening an item collapses any other expanded item.
     * @type {"single" | "multiple"}
     */
    export let type: "single" | "multiple" = "multiple";

    let ref: HTMLUListElement | null = null;

    function getHeadings(): HTMLElement[] {
        const list = ref;
        if (!list) return [];
        return Array.from(
            list.querySelectorAll<HTMLElement>(".atl-accordion__heading"),
        ).filter((heading) => heading.closest(".atl-accordion") === list);
    }

    function handleMove(_index: number, event: KeyboardEvent) {
        event.preventDefault();
    }

    const disableItems: Writable<boolean> = writable(disabled);
    $: disableItems.set(disabled);

    const openId: Writable<object | null> = writable(null);
    const typeStore: Writable<"single" | "multiple"> = writable(type);

    $: if (type === "single") {
        openId.set(null);
    }
    $: typeStore.set(type);

    function notifyOpen(itemKey: object) {
        if (type === "single") {
            openId.set(itemKey);
        }
    }

    function claimSingle(itemKey: object): boolean {
        const currentId = get(openId);
        if (currentId === null) {
            openId.set(itemKey);
            return true;
        }
        return currentId === itemKey;
    }

    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    function isMounted(): boolean {
        return mounted;
    }

    createIdScope($$restProps.id, "accordion");
    setContext("atl-accordion", {
        disableItems,
        openId,
        typeStore,
        notifyOpen,
        claimSingle,
        isMounted,
    });
</script>

<ul
    bind:this={ref}
    use:rovingFocus={{
        selector: ".atl-accordion__heading",
        orientation: "vertical",
        getItems: getHeadings,
        skipDisabled: true,
        onMove: handleMove,
        focusOnMove: true,
    }}
    class="atl-accordion"
    class:atl-accordion--start={align === "start"}
    class:atl-accordion--end={align === "end"}
    class:atl-accordion--outline={outline}
    {...$$restProps}
    on:click
    on:mouseover
    on:mouseenter
    on:mouseleave
>
    <slot />
</ul>

<style>
    .atl-accordion {
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
        max-width: 521px;
        background-color: var(--bgn-surface);
        border: none;
        border-radius: 0;
        overflow: hidden;

        &.atl-accordion--outline {
            border: var(--border-width-04) solid var(--border-color-subtle);
            border-radius: var(--border-radius-8);
        }
    }
</style>
