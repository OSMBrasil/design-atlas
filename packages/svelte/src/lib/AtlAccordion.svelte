<script lang="ts">
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

    const chevronDown = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_2752_2660" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="var(--color-base)"/></mask><g mask="url(#mask0_2752_2660)"><path d="M11.9997 14.45L19.3497 7.10005C19.5997 6.85005 19.8914 6.72922 20.2247 6.73755C20.5581 6.74588 20.8497 6.87505 21.0997 7.12505C21.3497 7.37505 21.4747 7.66672 21.4747 8.00005C21.4747 8.33338 21.3497 8.62505 21.0997 8.87505L13.4247 16.575C13.2247 16.775 12.9997 16.925 12.7497 17.025C12.4997 17.125 12.2497 17.175 11.9997 17.175C11.7497 17.175 11.4997 17.125 11.2497 17.025C10.9997 16.925 10.7747 16.775 10.5747 16.575L2.87474 8.87505C2.62474 8.62505 2.50391 8.32922 2.51224 7.98755C2.52058 7.64588 2.64974 7.35005 2.89974 7.10005C3.14974 6.85005 3.44141 6.72505 3.77474 6.72505C4.10808 6.72505 4.39974 6.85005 4.64974 7.10005L11.9997 14.45Z" fill="var(--color-base)"/></g></svg>`;

    const chevronUp = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_2752_2753" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="var(--color-base)"/></mask><g mask="url(#mask0_2752_2753)"><path d="M12.0001 9.54995L4.65007 16.9C4.40007 17.15 4.10841 17.2708 3.77507 17.2625C3.44174 17.2541 3.15007 17.125 2.90007 16.875C2.65007 16.625 2.52507 16.3333 2.52507 16C2.52507 15.6666 2.65007 15.375 2.90007 15.125L10.5751 7.42495C10.7751 7.22495 11.0001 7.07495 11.2501 6.97495C11.5001 6.87495 11.7501 6.82495 12.0001 6.82495C12.2501 6.82495 12.5001 6.87495 12.7501 6.97495C13.0001 7.07495 13.2251 7.22495 13.4251 7.42495L21.1251 15.125C21.3751 15.375 21.4959 15.6708 21.4876 16.0125C21.4792 16.3541 21.3501 16.65 21.1001 16.9C20.8501 17.15 20.5584 17.275 20.2251 17.275C19.8917 17.275 19.6001 17.15 19.3501 16.9L12.0001 9.54995Z" fill="var(--color-base)"/></g></svg>`;
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
            <span class="atl-accordion-chevron" aria-hidden="true">
                {#if isOpen}
                    {@html chevronUp}
                {:else}
                    {@html chevronDown}
                {/if}
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
