<script lang="ts">

    export let children;

</script>

<div class="button-group">
    {@render children?.()} 
</div>

<style>
    @import url(../../style/global.css);

    .button-group {
        display: inline-flex;
        line-height: 0; 
        width: fit-content;
        border-radius: var(--border-radius-4); 
        overflow: hidden;
        margin: 4px 0;
    }

    .button-group > * {
        border-radius: 0 !important; 
    }

    .button-group > *:first-child {
        border-top-left-radius: var(--group-border-radius) !important;
        border-bottom-left-radius: var(--group-border-radius) !important;
        margin-left: 0; 
    }

    .button-group > *:last-child {
        border-top-right-radius: var(--group-border-radius) !important;
        border-bottom-right-radius: var(--group-border-radius) !important;
    }

    .button-group > *:hover {
        position: relative;
        z-index: 1; 
    }
</style>