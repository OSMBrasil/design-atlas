<script lang="ts">
    import type { IconDefinition } from '@design-atlas/ms-icons';
    import AtlIcon from './AtlIcon.svelte';
    import { getAtlLocale } from './i18n/messages.js';

    const atlLocale = getAtlLocale();

    export interface TabItem {
        label: string;
        href: string;
        icon?: IconDefinition | string;
        disabled?: boolean;
        selected?: boolean;
        id?: string;
    }

    export let items: TabItem[] = [];
    export let ariaLabel: string = '';

    $: resolvedAriaLabel = ariaLabel || atlLocale.messages.tabs.navigationLabel;

    let selectedIndex = 0;
    let tabEls: (HTMLAnchorElement | null)[] = [];

    $: {
        const foundIndex = items.findIndex((item) => item.selected);
        selectedIndex = foundIndex >= 0 ? foundIndex : 0;
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

    function isRtl(el: HTMLElement | null): boolean {
        if (typeof window === 'undefined' || !el) {
            return atlLocale.dir === 'rtl';
        }
        return window.getComputedStyle(el).direction === 'rtl';
    }

    function selectAndFocus(index: number) {
        selectedIndex = index;
        tabEls[index]?.focus();
    }

    function handleTabClick(event: MouseEvent, index: number) {
        if (items[index]?.disabled) {
            event.preventDefault();
            return;
        }
        selectedIndex = index;
    }

    function handleKeydown(event: KeyboardEvent, currentIndex: number) {
        const enabled = getEnabledIndices();
        if (enabled.length === 0) return;

        const currentPos = enabled.indexOf(currentIndex);
        const rtl = isRtl(event.currentTarget as HTMLElement | null);

        const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight';
        const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft';

        if (event.key === nextKey) {
            event.preventDefault();
            const nextPos = currentPos >= 0 ? (currentPos + 1) % enabled.length : 0;
            selectAndFocus(enabled[nextPos]);
        } else if (event.key === prevKey) {
            event.preventDefault();
            const prevPos = currentPos >= 0 ? (currentPos - 1 + enabled.length) % enabled.length : enabled.length - 1;
            selectAndFocus(enabled[prevPos]);
        } else if (event.key === 'Home') {
            event.preventDefault();
            selectAndFocus(enabled[0]);
        } else if (event.key === 'End') {
            event.preventDefault();
            selectAndFocus(enabled[enabled.length - 1]);
        }
    }
</script>

<div class="atl-tabs" role="tablist" aria-label={resolvedAriaLabel}>
    {#each items as item, index}
        <a
            bind:this={tabEls[index]}
            href={item.disabled ? undefined : item.href}
            role="tab"
            aria-selected={selectedIndex === index}
            aria-disabled={item.disabled || undefined}
            aria-controls={item.id || `panel-${index}`}
            tabindex={item.disabled ? -1 : selectedIndex === index ? 0 : -1}
            class="atl-tabs__tab"
            class:atl-tabs__tab--selected={selectedIndex === index}
            class:atl-tabs__tab--disabled={item.disabled}
            on:click={(event) => handleTabClick(event, index)}
            on:keydown={(event) => handleKeydown(event, index)}
        >
            {#if item.icon}
                <span class="atl-tabs__icon" aria-hidden="true">
                    <AtlIcon icon={item.icon} size="20px" />
                </span>
            {/if}
            {item.label}
        </a>
    {/each}
</div>

<style>
    .atl-tabs {
        width: fit-content;
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-semibold);
        line-height: var(--line-height-label);
        display: flex;
        flex-direction: row;
    }

    .atl-tabs__tab {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-4);
        padding: var(--spacing-8) var(--spacing-16);
        border-start-start-radius: var(--border-radius-4);
        border-start-end-radius: var(--border-radius-4);
        color: var(--color-base);
        text-decoration: var(--text-decoration-none);
        border-bottom: var(--border-width-2) solid var(--border-color-subtle);
        margin: 0;
        cursor: var(--cursor-pointer);

        &:hover {
            background-color: var(--bgn-surface-hover);
            color: var(--color-base-hover);
        }

        &:focus-visible {
            outline: 2px solid var(--border-color-focus);
            outline-offset: -2px;
            border-radius: var(--border-radius-4);
        }

        &.atl-tabs__tab--selected {
            color: var(--color-accent);
            border-bottom: var(--border-width-2) solid var(--border-color-accent);

            &:hover {
                background-color: var(--bgn-foreground);
                color: var(--color-accent-hover);
            }
        }

        &.atl-tabs__tab--disabled {
            pointer-events: none;
            color: var(--color-disable);
            border-bottom: var(--border-width-2) solid var(--border-color-disable);
            cursor: var(--cursor-disable);
        }
    }

    .atl-tabs__icon {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }
</style>
