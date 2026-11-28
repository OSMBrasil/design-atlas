<script lang="ts">

    export let children;

</script>

<div class="button-group">
    <span class="group-content">{@render children?.()}</span>
</div>

<style>
    .button-group {
        display: inline-flex;
        line-height: 0; 
        width: fit-content;
        border-radius: var(--border-radius-4); 
        overflow: hidden;
        margin: 4px 0;
    }

    .button-group :global(> *) {
        border-radius: 0 !important; 
    }

    .button-group :global(> *:first-child) {
        border-start-start-radius: var(--border-radius-4) !important;
        border-end-start-radius: var(--border-radius-4) !important;
        margin-inline-start: 0; 
    }

    .button-group :global(> *:last-child) {
        border-start-end-radius: var(--border-radius-4) !important;
        border-end-end-radius: var(--border-radius-4) !important;
    }

    .button-group :global(> *:hover) {
        position: relative;
        z-index: 1; 
    }
</style>