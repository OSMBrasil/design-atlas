<script lang="ts">

    export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
    export let variant: 'default' | 'close' | 'sheet' = 'default';
    
    let isVisible = true;
    let isMinimized = false;
    
    const close = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="none"/><mask id="mask0_2741_1521" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"><rect width="20" height="20" fill="var(--color-inverse)"/></mask><g mask="url(#mask0_2741_1521)"><path d="M9.99998 11.1667L5.91665 15.25C5.76387 15.4028 5.56942 15.4792 5.33331 15.4792C5.0972 15.4792 4.90276 15.4028 4.74998 15.25C4.5972 15.0973 4.52081 14.9028 4.52081 14.6667C4.52081 14.4306 4.5972 14.2362 4.74998 14.0834L8.83331 10L4.74998 5.91671C4.5972 5.76393 4.52081 5.56949 4.52081 5.33337C4.52081 5.09726 4.5972 4.90282 4.74998 4.75004C4.90276 4.59726 5.0972 4.52087 5.33331 4.52087C5.56942 4.52087 5.76387 4.59726 5.91665 4.75004L9.99998 8.83337L14.0833 4.75004C14.2361 4.59726 14.4305 4.52087 14.6666 4.52087C14.9028 4.52087 15.0972 4.59726 15.25 4.75004C15.4028 4.90282 15.4791 5.09726 15.4791 5.33337C15.4791 5.56949 15.4028 5.76393 15.25 5.91671L11.1666 10L15.25 14.0834C15.4028 14.2362 15.4791 14.4306 15.4791 14.6667C15.4791 14.9028 15.4028 15.0973 15.25 15.25C15.0972 15.4028 14.9028 15.4792 14.6666 15.4792C14.4305 15.4792 14.2361 15.4028 14.0833 15.25L9.99998 11.1667Z" fill="var(--color-base)"/></g></svg>`;
    const sheet = `<svg width="80" height="4" viewBox="0 0 80 4" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="4" rx="2" fill="#D9D9D9"/></svg>`;
    
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
        <button class="sheet" on:click={handleMinimize}>{@html sheet}</button>
    {/if}
    {#if variant === 'close'}
            <button class="close" on:click={handleClose}>{@html close}</button>
    {/if}
    <div class="container {size}" class:minimized={isMinimized}>
        <slot></slot>
    </div>
</div>
{/if}

<style>
    @import url(../../style/global.css);
    
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
        right: -1%;
        top: -3%;
        cursor: pointer;
        background: transparent;
        border: none;
    }
    
    .sheet {
        position: absolute;
        top: -3px;
        left: 42%;
        cursor: pointer;
        background: transparent;
        border: none;
        z-index: 5;
        transition: transform 0.3s ease;
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