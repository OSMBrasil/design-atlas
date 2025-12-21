<script lang="ts">
    export interface TabItem {
        label: string;
        href: string;
        icon?: string;
        disabled?: boolean;
        selected?: boolean;
        id?: string;
    }

    export let items: TabItem[] = [];
    export let ariaLabel: string = "Tabs navigation";

    let selectedIndex = items.findIndex(item => item.selected) || 0;

    function handleTabClick(index: number) {
        if (!items[index].disabled) {
            selectedIndex = index;
        }
    }
</script>

<div class="tabs" role="tablist" aria-label={ariaLabel}>
    {#each items as item, index}
        <a 
            href={item.href}
            role="tab"
            aria-selected={selectedIndex === index}
            aria-controls={item.id || `panel-${index}`}
            tabindex={item.disabled ? -1 : 0}
            class="tab"
            class:select={selectedIndex === index}
            class:disable={item.disabled}
            on:click={() => handleTabClick(index)}
        >
            {#if item.icon}
                <span class="icon" aria-hidden="true">{@html item.icon}</span>
            {/if}
            {item.label}
        </a>
    {/each}
</div>

<style>
    @import url(../../style/global.css);
    
    .tabs {
        width: fit-content;
        font-size: var(--font-size-14);
        font-weight: 600;
        display: flex;
        flex-direction: row;
    }
    
    .tab {
        display: flex;
        align-items: last baseline;
        height: 38px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        padding: 0 16px 8px 16px;
        text-decoration: none;
        border-bottom: 2px solid var(--color-subtle);
        margin: 0;
    }
    
    .tab:hover {
        background-color: var(--bgn-disable);
        border-bottom: 2px solid var(--bgn-disable);
    }
    
    .select {
        border-bottom: 3px solid var(--color-accent);
    }
    
    .tab.select:hover {
        color: var(--color-accent-hover);
        background-color: var(--bgn-foreground);
        border-bottom: 3px solid var(--color-accent);
    }
    
    .tab:focus {
        outline: none;
        border-bottom: 3px solid var(--color-accent);
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }
    
    .select.tab:focus {
        outline: 2px solid var(--color-accent);
        border-bottom: none;
        border-radius: 4px;
    }
    
    .disable {
        pointer-events: none;
        color: var(--bgn-disable);
        border-bottom: 2px solid var(--bgn-base);
    }

    .icon {
        margin-right: 8px;
        display: inline-flex;
        align-items: center;
    }
</style>