<script>
	import { check as checkIcon, remove as removeIcon } from '@design-atlas/ms-icons';
	import AtlIcon from './AtlIcon.svelte';

	export let checked = false;
	export let indeterminate = false;
	export let disabled = false;
	export let error = false;
	export let description = '';
</script>

<label class="atl-checkbox" class:disabled class:error>
	<span class="atl-checkbox-control">
		<input
			type="checkbox"
			class="atl-checkbox-input"
			bind:checked
			bind:indeterminate
			{disabled}
			aria-invalid={error || undefined}
			on:change
		/>
		{#if checked || indeterminate}
			<span class="atl-checkbox-icon" aria-hidden="true">
				<AtlIcon icon={indeterminate ? removeIcon : checkIcon} size="12px" />
			</span>
		{/if}
	</span>

	<span class="atl-checkbox-content">
		<span class="atl-checkbox-label"><slot /></span>
		{#if description}
			<span class="atl-checkbox-description">{description}</span>
		{/if}
	</span>
</label>

<style>
	.atl-checkbox {
		display: inline-flex;
		align-items: flex-start;
		gap: var(--spacing-8);
		width: fit-content;
		font-family: var(--font-family-sans-serif);
		color: var(--color-base);
		cursor: var(--cursor-pointer);

		&.disabled {
			cursor: var(--cursor-not-allowed);
		}
	}

	.atl-checkbox-control {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--size-16);
		height: var(--size-16);
		flex-shrink: 0;
		margin-block-start: 2px;
	}

	.atl-checkbox-input {
		appearance: none;
		width: var(--size-16);
		height: var(--size-16);
		margin: 0;
		background-color: var(--color-inverse);
		border-radius: 2px;
		border: var(--border-width-2) solid var(--border-color-base);
		cursor: var(--cursor-pointer);

		&:hover:not(:disabled) {
			background-color: var(--bgn-foreground);
			border-color: var(--border-color-accent);
		}

		&:checked,
		&:indeterminate {
			background-color: var(--bgn-accent);
			border-color: var(--border-color-accent);
		}

		&:checked:hover:not(:disabled),
		&:indeterminate:hover:not(:disabled) {
			background-color: var(--bgn-accent-hover);
			border-color: var(--color-accent-hover);
		}

		&:focus-visible {
			outline: 2px solid var(--border-color-focus);
			outline-offset: 2px;
		}

		&:disabled {
			background-color: var(--bgn-disable);
			border-color: var(--border-color-base);
			cursor: var(--cursor-not-allowed);
		}
	}

	.atl-checkbox.error .atl-checkbox-input {
		border-color: var(--border-color-error);

		&:hover:not(:disabled) {
			background-color: var(--bgn-error);
			border-color: var(--border-color-error);
		}

		&:checked,
		&:indeterminate {
			background-color: var(--bgn-danger);
			border-color: var(--border-color-error);
		}

		&:checked:hover:not(:disabled),
		&:indeterminate:hover:not(:disabled) {
			background-color: var(--bgn-danger-hover);
			border-color: var(--bgn-danger-hover);
		}

		&:disabled {
			background-color: var(--bgn-disable);
			border-color: var(--border-color-base);
		}
	}

	.atl-checkbox-icon {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		color: var(--color-inverse);
	}

	.atl-checkbox.disabled .atl-checkbox-icon {
		color: var(--color-base);
	}

	.atl-checkbox-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.atl-checkbox-label {
		font-size: var(--font-size-16);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-label);
		color: var(--color-base);
	}

	.atl-checkbox-description {
		font-size: var(--font-size-12);
		line-height: var(--line-height-label);
		color: var(--color-subtle);
	}
</style>