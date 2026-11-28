<script lang="ts">
	export let ariaLabel = '';
	export let children;
</script>

<div class="atl-button-group" role="group" aria-label={ariaLabel || undefined}>
	{@render children?.()}
</div>

<style>
	.atl-button-group {
		display: inline-flex;
		align-items: stretch;
		width: fit-content;
		border-radius: var(--border-radius-4);
		margin-block: var(--spacing-4);

		& :global(> *) {
			border-radius: 0;
		}

		& :global(> *:not(:last-child)) {
			border-inline-end: var(--border-width-1) solid var(--border-color-subtle);
		}

		& :global(> *:first-child) {
			border-start-start-radius: var(--border-radius-4);
			border-end-start-radius: var(--border-radius-4);
			margin-inline-start: 0;
		}

		& :global(> *:last-child) {
			border-start-end-radius: var(--border-radius-4);
			border-end-end-radius: var(--border-radius-4);
		}

		& :global(> *:hover),
		& :global(> *:focus-visible) {
			position: relative;
			z-index: 1;
		}
	}
</style>