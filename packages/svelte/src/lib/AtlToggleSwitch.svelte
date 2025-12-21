<script lang="ts">
    import AtlLabel from "./AtlLabel.svelte"; 

    let {
        label = '',
        value = $bindable('on'),
        description = '',
        disabled = false
    } = $props();

    let checked = $state(true);

    const uniqueID = `switch-${Math.floor(Math.random() * 10000)}`;

    function handleClick(event) {
        if (disabled) return; 

        checked = !checked;
        value = checked ? 'on' : 'off';
    }
</script>

<div class="toggle-container" class:disabled={disabled}> 
    <AtlLabel 
        id={uniqueID} 
        label={label} 
        description={description}
        disabled={disabled}
    />

    <button
        id={uniqueID} 
        role="switch"
        aria-checked={checked}
        aria-labelledby={uniqueID}
        aria-describedby={description ? `${uniqueID}-description` : undefined}
        onclick={handleClick}
        disabled={disabled}
    >
    </button>

    {#if description}
        <span id={`${uniqueID}-description`} class="sr-only">{description}</span>
    {/if}
</div>

<style>

    .toggle-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .toggle-container.disabled button{
        background-color: var(--bgn-disable) !important; 
        border-color: var(--bgn-disable) !important;
    }
    
    .toggle-container button {
        width: 40px;
        height: 20px;
        position: relative;
        border: 0.4px solid var(--border-color-base);
        border-radius: 1.5em;
        cursor: pointer;
        pointer-events: auto; 
    }

    .toggle-container.disabled button {
        cursor: not-allowed;
    }

    button:focus {
        outline: 2px solid var(--color-accent) !important;
        outline-offset: 1px;
    }

    button:hover:not(:disabled) {
        background-color: var(--bgn-base);
    }

    .toggle-container button::before {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        background: var(--color-base);
        top: 1.2px;
        right: 21px;
        transition: transform 0.3s;
        border-radius: 100%;
    }

    .toggle-container button[aria-checked='true'] {
        background-color: var(--bgn-accent);
        border-color: var(--bgn-accent);
    }

    .toggle-container button[aria-checked='true']:hover:not(:disabled) {
        background-color: var(--bgn-accent-hover);
    }

    .toggle-container button[aria-checked='true']::before {
        background-color: var(--bgn-surface);
        transform: translateX(21px);
        transition: transform 0.3s;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
        white-space: nowrap;
    }

</style>