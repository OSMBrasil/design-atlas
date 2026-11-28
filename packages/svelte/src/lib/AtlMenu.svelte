<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { chevronRight, type IconDefinition } from '@design-atlas/ms-icons';
    import AtlIcon from './AtlIcon.svelte';
    import AtlTooltip from './AtlTooltip.svelte';
    import { getAtlLocale } from './i18n/messages.js';

    const atlLocale = getAtlLocale();
    const dispatch = createEventDispatcher<{ close: void }>();

    export interface MenuItem {
        label: string;
        href: string;
        icon?: IconDefinition | string;
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
        rel?: string;
    }

    export let items: MenuItem[] = [];
    /** @deprecated Kept for backwards compatibility; visible item labels are announced directly. */
    export let linkAriaLabel: string = '';
    export let moreThan99ItemsLabel: string = '';
    export let itemsCountLabel: ((count: number) => string) | undefined = undefined;

    $: void linkAriaLabel;
    $: resolvedMoreThan99 = moreThan99ItemsLabel || atlLocale.messages.menu.moreThan99Items;
    $: formatItemsCount = itemsCountLabel || atlLocale.messages.menu.itemsCount;

    let itemEls: (HTMLAnchorElement | null)[] = [];
    let activeIndex = 0;

    $: {
        const firstEnabled = items.findIndex((item) => !item.disabled);
        activeIndex = firstEnabled >= 0 ? firstEnabled : 0;
    }

    function getEnabledIndices(): number[] {
        const indices: number[] = [];
        for (let i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                indices.push(i);
            }
        }
        return indices;
    }

    function focusItem(index: number) {
        activeIndex = index;
        itemEls[index]?.focus();
    }

    function handleKeydown(event: KeyboardEvent, currentIndex: number) {
        const enabled = getEnabledIndices();
        if (enabled.length === 0) return;

        const currentPos = enabled.indexOf(currentIndex);

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                const nextPos = currentPos >= 0 ? (currentPos + 1) % enabled.length : 0;
                focusItem(enabled[nextPos]);
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                const prevPos = currentPos >= 0 ? (currentPos - 1 + enabled.length) % enabled.length : enabled.length - 1;
                focusItem(enabled[prevPos]);
                break;
            }
            case 'Home': {
                event.preventDefault();
                focusItem(enabled[0]);
                break;
            }
            case 'End': {
                event.preventDefault();
                focusItem(enabled[enabled.length - 1]);
                break;
            }
            case 'Escape': {
                event.preventDefault();
                (event.currentTarget as HTMLElement | null)?.blur();
                dispatch('close');
                break;
            }
        }
    }

    function handleClick(event: MouseEvent, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
        }
    }
</script>

<div class="atl-menu" role="menu">
    {#each items as item, index}
        <a
            bind:this={itemEls[index]}
            href={item.disabled ? undefined : item.href}
            target={item.disabled ? undefined : item.target || '_self'}
            rel={item.disabled ? undefined : item.rel || undefined}
            role="menuitem"
            aria-disabled={item.disabled || undefined}
            tabindex={item.disabled ? -1 : index === activeIndex ? 0 : -1}
            class="atl-menu__item"
            class:atl-menu__item--disabled={item.disabled}
            on:focus={() => {
                if (!item.disabled) activeIndex = index;
            }}
            on:keydown={(event) => handleKeydown(event, index)}
            on:click={(event) => handleClick(event, item)}
        >
            {#if item.icon}
                <span class="atl-menu__icon" aria-hidden="true">
                    <AtlIcon icon={item.icon} size="20px" />
                </span>
            {/if}

            <span class="atl-menu__label">{item.label}</span>

            {#if item.tiptext}
                <AtlTooltip text={item.tiptext} direction={item.tipdirection || 'right'} />
            {/if}

            {#if item.badgeNumber && item.badgeNumber > 0}
                <span
                    class="atl-menu__badge"
                    role="status"
                    aria-label={
                        item.badgeNumber > 99
                            ? resolvedMoreThan99
                            : formatItemsCount(item.badgeNumber)
                    }
                >
                    {item.badgeNumber > 99 ? '99+' : item.badgeNumber}
                </span>
            {/if}

            {#if item.chevron}
                <span class="atl-menu__chevron" aria-hidden="true">
                    <AtlIcon icon={chevronRight} size="20px" />
                </span>
            {/if}
        </a>
    {/each}
</div>

<style>
    .atl-menu {
        width: fit-content;
        min-width: var(--dimension-144);
        background-color: var(--bgn-surface);
        border: var(--border-width-04) solid var(--border-color-subtle);
        border-radius: var(--border-radius-4);
        padding-block: var(--spacing-8);
        box-shadow: var(--shadow-md);
    }

    .atl-menu__item {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--spacing-8);
        padding-block: var(--spacing-8);
        padding-inline: var(--spacing-12) var(--spacing-16);
        color: var(--color-base);
        font-size: var(--font-size-16);
        line-height: var(--line-height-label);
        text-decoration: var(--text-decoration-none);
        border-radius: var(--border-radius-4);
        cursor: var(--cursor-pointer);

        &:hover {
            background-color: var(--bgn-surface-hover);
        }

        &:focus-visible {
            outline: 2px solid var(--border-color-focus);
            outline-offset: -2px;
        }

        &.atl-menu__item--disabled {
            pointer-events: none;
            color: var(--color-disable);
            cursor: var(--cursor-disable);
        }
    }

    .atl-menu__icon {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }

    .atl-menu__label {
        flex: 1 1 auto;
    }

    .atl-menu__badge {
        margin-inline-start: var(--spacing-4);
        padding-block: 0;
        padding-inline: var(--spacing-4);
        background-color: var(--bgn-danger);
        color: var(--color-inverse);
        border-radius: var(--border-radius-4);
        font-size: var(--font-size-12);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-label);
        min-width: var(--dimension-32);
        min-height: var(--size-20);
        text-align: center;
        justify-content: center;
        align-items: center;
        display: inline-flex;
        flex-shrink: 0;
    }

    .atl-menu__chevron {
        margin-inline-start: auto;
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }
</style>
