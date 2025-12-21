<script lang="ts">
    import AtlTooltip from "./AtlTooltip.svelte";

    export interface MenuItem {
        label: string;
        href: string;
        icon?: string;
        tiptext?: string;
        tipicon?: string;
        tipdirection?: 
            | 'top'
            | 'top-start'
            | 'top-end'
            | 'bottom'
            | 'bottom-start'
            | 'bottom-end'
            | 'left'
            | 'left-start'
            | 'left-end'
            | 'right'
            | 'right-start'
            | 'right-end';
        badgeNumber?: number;
        chevron?: boolean;
        disabled?: boolean;
        target?: '_blank' | '_self' | '_parent' | '_top';
        rel?: string
    }

    export let items: MenuItem[] = [];

    const chevron = `<svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.15001 6.31664L0.250008 1.41664C0.0833416 1.24997 0.00278568 1.05553 0.00834131 0.833303C0.0138969 0.611081 0.100008 0.416637 0.266675 0.24997C0.433341 0.0833035 0.627786 -2.95639e-05 0.850008 -2.95639e-05C1.07223 -2.95639e-05 1.26667 0.0833035 1.43334 0.24997L6.56667 5.36664C6.70001 5.49997 6.80001 5.64997 6.86667 5.81664C6.93334 5.9833 6.96667 6.14997 6.96667 6.31664C6.96667 6.4833 6.93334 6.64997 6.86667 6.81664C6.80001 6.9833 6.70001 7.1333 6.56667 7.26664L1.43334 12.4C1.26667 12.5666 1.06945 12.6472 0.841675 12.6416C0.613897 12.6361 0.416675 12.55 0.250008 12.3833C0.0833416 12.2166 8.10623e-06 12.0222 8.10623e-06 11.8C8.10623e-06 11.5777 0.0833416 11.3833 0.250008 11.2166L5.15001 6.31664Z" fill="var(--color-base)"/></svg>`

</script>

<div class="menu">
    {#each items as item}
        <a 
            href={item.href}
            target={item.target || '_self'}
            rel={item.rel || ''}
            tabindex={item.disabled ? -1 : 0}
            class:disabled={item.disabled}
            aria-label="link"
            class="item"
            >
            {#if item.icon}
                <span class="icon" aria-hidden="true">{@html item.icon}</span>
            {/if}
            {item.label}
            {#if item.tiptext}
                <AtlTooltip text={item.tiptext} direction={item.tipdirection || 'right'}></AtlTooltip>
            {/if}

            {#if item.badgeNumber && item.badgeNumber > 0}
                <span 
                    class="badge"
                    role="status"
                    aria-label={
                        item.badgeNumber > 99
                            ? 'More than 99 itens'
                            : `${item.badgeNumber} itens`
                    }
                >
                    {item.badgeNumber > 99 ? '99+' : item.badgeNumber}
                </span>
            {/if}

            {#if item.chevron}
                <span class="chevron-right" aria-hidden="true">
                    {@html chevron}
                </span>
            {/if}

        </a>
    {/each}
</div>

<style>
    @import url(../../../../style/global.css);
    
    .menu {
        width: fit-content;
        min-width: 144px;
        border: 0.4px solid;
        border-color: var(--border-color-base);
        border-radius: 4px;
        box-shadow: var(--shadow-sm);
    }

    .item {
        position: relative;
        padding: 8px var(--spacing-24) 4px var(--spacing-8);   
    }

    .item:focus {
        background-color: var(--bgn-color-accent);
    }

    .item:hover {
        background-color: var(--bgn-disable);
    }

    a.disabled {
        pointer-events: none;
        color: var(--color-disable);
    }

    .menu a {
        text-decoration: none;
        display: block;
        border-radius: 4px;
    }

    .menu a:focus {
        outline: 2px solid var(--border-color-focus);
        outline-offset: 1px;
    }

    .menu a:focus .item {
        border: 2px solid var(--border-color-focus);
    }

    .badge {
        margin-left: 6px;
        padding: 0px 2px;
        background-color: red;
        display: inline;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 700;
        color: var(--white);
        min-width: 32px;
        height: 17px;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: inline-flex;
    }

    .chevron-right {
        position: absolute;
        right: 10% !important;
        
    }

</style>