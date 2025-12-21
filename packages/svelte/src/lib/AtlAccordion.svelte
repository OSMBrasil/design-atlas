<script lang="ts">
    export interface AccordionItem {
        label: string;
        content: string;
    }
    export let items: AccordionItem[] = [];

    let openItemLabel: string | null = null;

    function showHide(itemLabel: string) {
        if (openItemLabel === itemLabel) {
            openItemLabel = null;
        } else {
            openItemLabel = itemLabel;
        }
    }

    const chevronDown = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_2752_2660" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="var(--color-base)"/></mask><g mask="url(#mask0_2752_2660)"><path d="M11.9997 14.45L19.3497 7.10005C19.5997 6.85005 19.8914 6.72922 20.2247 6.73755C20.5581 6.74588 20.8497 6.87505 21.0997 7.12505C21.3497 7.37505 21.4747 7.66672 21.4747 8.00005C21.4747 8.33338 21.3497 8.62505 21.0997 8.87505L13.4247 16.575C13.2247 16.775 12.9997 16.925 12.7497 17.025C12.4997 17.125 12.2497 17.175 11.9997 17.175C11.7497 17.175 11.4997 17.125 11.2497 17.025C10.9997 16.925 10.7747 16.775 10.5747 16.575L2.87474 8.87505C2.62474 8.62505 2.50391 8.32922 2.51224 7.98755C2.52058 7.64588 2.64974 7.35005 2.89974 7.10005C3.14974 6.85005 3.44141 6.72505 3.77474 6.72505C4.10808 6.72505 4.39974 6.85005 4.64974 7.10005L11.9997 14.45Z" fill="var(--color-base)"/></g></svg>`;
    
    const chevronUp = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_2752_2753" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="var(--color-base)"/></mask><g mask="url(#mask0_2752_2753)"><path d="M12.0001 9.54995L4.65007 16.9C4.40007 17.15 4.10841 17.2708 3.77507 17.2625C3.44174 17.2541 3.15007 17.125 2.90007 16.875C2.65007 16.625 2.52507 16.3333 2.52507 16C2.52507 15.6666 2.65007 15.375 2.90007 15.125L10.5751 7.42495C10.7751 7.22495 11.0001 7.07495 11.2501 6.97495C11.5001 6.87495 11.7501 6.82495 12.0001 6.82495C12.2501 6.82495 12.5001 6.87495 12.7501 6.97495C13.0001 7.07495 13.2251 7.22495 13.4251 7.42495L21.1251 15.125C21.3751 15.375 21.4959 15.6708 21.4876 16.0125C21.4792 16.3541 21.3501 16.65 21.1001 16.9C20.8501 17.15 20.5584 17.275 20.2251 17.275C19.8917 17.275 19.6001 17.15 19.3501 16.9L12.0001 9.54995Z" fill="var(--color-base)"/></g></svg>`;
</script>

<div class="accordion">
    {#each items as item, index}
    <button 
        id={item.label} 
        class="item" 
        class:open={openItemLabel === item.label}
        on:click={() => showHide(item.label)} 
        aria-expanded={openItemLabel === item.label}
        aria-controls={`content-${item.label.replace(/\s/g, '-')}`}
    >
        <div class="label">
            {item.label}
            <span class="chevron-down" aria-hidden="true">
                {#if openItemLabel !== item.label}
                    {@html chevronDown}
                {/if}
            </span>
            <span class="chevron-up" aria-hidden="true">
                {#if openItemLabel == item.label}
                    {@html chevronUp}
                {/if}
            </span>
        </div>
    </button>
    {#if index < items.length - 1 || openItemLabel === item.label}
    <div class="divline"></div>
    {/if}
    {#if openItemLabel === item.label}
    <div 
            class="content" 
            class:open={openItemLabel === item.label}
            id={`content-${item.label.replace(/\s/g, '-')}`}
        >
            {@html item.content}
    </div>
    {#if index < items.length - 1}
    <div class="divline"></div>
    {/if}
    {/if}
    {/each}
</div>

<style>
    @import url(../../style/global.css);
    
    .accordion {
        position: relative;
        width: 684px;
        border: 1px solid var(--border-color-base);
        border-radius: 8px;
        box-shadow: var(--shadow-md);
    }

    .content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out, padding 0.3s ease-out;
        padding: 16px;
    }
    .divline {
        height: 1px;
        opacity: 0.5;
        background-color: var(--border-color-base);
    }

    .chevron-down {
        position: absolute;
        right: 3%;
    }

    .chevron-up {
        position: absolute;
        right: 3%;
    }

    .item {
        display: block;
        width: 100%;
        text-align: left;
        padding: 16px;
        border: none;
        background: transparent;
        border-radius: 8px;
        border: none;
    }

    .content {
        max-height: 286px;
        padding-top: 16px;
        color: var(--color-subtle);
    }

    .item:hover {
        background-color: var(--bgn-disable);
        cursor: pointer;
    }

    .item:focus {
        outline: 2px solid var(--border-color-accent);
        outline-offset: 2px;
    }

    .label {
        font-weight: 600;
        color: var(--color-emphasized);
    }
</style>