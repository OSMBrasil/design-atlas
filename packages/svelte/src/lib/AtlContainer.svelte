<script lang="ts">
    import { close as closeIcon } from '@design-atlas/ms-icons';
    import AtlIcon from './AtlIcon.svelte';
    import { getAtlLocale } from './i18n/messages.js';

    const atlLocale = getAtlLocale();

    export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
    export let variant: 'default' | 'close' | 'sheet' = 'default';
    export let closeLabel: string = '';
    export let toggleSheetLabel: string = '';

    $: resolvedCloseLabel = closeLabel || atlLocale.messages.container.close;
    $: resolvedToggleSheetLabel = toggleSheetLabel || atlLocale.messages.container.toggleSheet;
    
    let isVisible = true;
    let isMinimized = false;
    
    function handleClose() {
        isVisible = false;
    }
    
    function handleMinimize() {
        isMinimized = !isMinimized;
    }
</script>

{#if isVisible}
<div class="wrapper {size} class:closed={!isVisible}">
    {#if variant === 'sheet'}
        <button type="button" class="sheet" aria-label={resolvedToggleSheetLabel} on:click={handleMinimize}>
            <span class="sheet-handle" aria-hidden="true"></span>
        </button>
    {/if}
    {#if variant === 'close'}
        <button type="button" class="close color-base" aria-label={resolvedCloseLabel} on:click={handleClose}>
            <AtlIcon icon={closeIcon} size="20px" />
        </button>
    {/if}
    <div class="container {size}" class:minimized={isMinimized}>
        <slot></slot>
    </div>
</div>
{/if}

<style>
    .wrapper {
        position: relative;
    }

    .wrapper:has(.close) {
        margin-top: 24px;
    }

    .wrapper:has(.sheet) {
        padding-top: 24px;
    }
    
    .container {
        position: relative;
        transition: height 0.3s ease, opacity 0.3s ease;
        height: 553px;
        overflow: hidden;
        opacity: 1;
    }
    
    .container.minimized {
        height: 0;
        opacity: 0;
        border: none;
    }
    
    .close {
        position: absolute;
        inset-inline-end: -1%;
        inset-block-start: -3%;
        cursor: pointer;
        background: transparent;
        border: none;
    }
    
    .sheet {
        position: absolute;
        inset-block-start: -3px;
        inset-inline-start: 42%;
        cursor: pointer;
        background: transparent;
        border: none;
        z-index: 5;
        transition: transform 0.3s ease;
    }

    .sheet-handle {
        display: block;
        width: 80px;
        height: 4px;
        border-radius: 2px;
        background-color: var(--border-color-subtle);
    }

    .sheet:hover {
        transform: scale(1.1);
    }
    
    .sm {
        width: 448px;
    }
    .md {
        width: 552px;    
    }
    .lg {
        width: 808px;    
    }
    .xl {
        width: 896px;    
    }
</style>