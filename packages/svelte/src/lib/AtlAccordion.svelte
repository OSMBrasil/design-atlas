<script lang="ts">
    import { keyboardArrowDown, keyboardArrowUp } from '@design-atlas/ms-icons';
    import AtlIcon from './AtlIcon.svelte';

    export interface AccordionItem {
        label: string;
        content: string;
    }
    export let items: AccordionItem[] = [];

    let openItemLabel: string | null = null;

    function showHide(itemLabel: string) {
        openItemLabel = openItemLabel === itemLabel ? null : itemLabel;
    }

    function toSlug(text: string, index: number): string {
        return `${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;
    }
</script>

<div class="atl-accordion">
    {#each items as item, index}
        {@const isOpen = openItemLabel === item.label}
        {@const slug = toSlug(item.label, index)}
        <button
            id={`atl-accordion-trigger-${slug}`}
            type="button"
            class="atl-accordion-item"
            class:open={isOpen}
            on:click={() => showHide(item.label)}
            aria-expanded={isOpen}
            aria-controls={`atl-accordion-content-${slug}`}
        >
            <span class="atl-accordion-label label">
                {item.label}
            </span>
            <span class="atl-accordion-chevron color-base" aria-hidden="true">
                <AtlIcon icon={isOpen ? keyboardArrowUp : keyboardArrowDown} size="24px" />
            </span>
        </button>

        {#if isOpen}
            <div
                class="atl-accordion-content body-md color-base"
                id={`atl-accordion-content-${slug}`}
            >
                {@html item.content}
            </div>
        {/if}

        {#if index < items.length - 1}
            <div class="atl-accordion-divider"></div>
        {/if}
    {/each}
</div>

<style>
    .atl-accordion {
        width: 100%;
        max-width: 521px;
        background-color: var(--bgn-surface);
        border: var(--border-width-04, 0.4px) solid var(--border-color-subtle);
        border-radius: var(--border-radius-8);
        overflow: hidden;
    }

    .atl-accordion-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        text-align: start;
        padding: var(--spacing-16);
        border: none;
        background: transparent;
        cursor: pointer;

        &:hover {
            background-color: var(--bgn-surface-hover);
        }

        &:focus-visible {
            outline: 2px solid var(--border-color-focus);
            outline-offset: -2px;
        }
    }

    .atl-accordion-chevron {
        display: inline-flex;
        flex-shrink: 0;
    }

    .atl-accordion-content {
        padding: var(--spacing-16) var(--spacing-16) var(--spacing-24);
        border-top: var(--border-width-04, 0.4px) solid var(--border-color-subtle);
    }

    .atl-accordion-divider {
        height: 0;
        border-top: var(--border-width-04, 0.4px) solid var(--border-color-subtle);
    }
</style>
