<script lang="ts">
	import AtlLabel from './AtlLabel.svelte';

	let {
		id = '',
		label = '',
		value = $bindable('on'),
		description = '',
		disabled = false,
		visuallyHidden = false,
		onchange = undefined as ((value: 'on' | 'off') => void) | undefined
	} = $props();

	const checked = $derived(value === 'on');
	const generatedId = `atl-switch-${Math.random().toString(36).slice(2, 9)}`;
	const switchId = $derived(id || generatedId);
	const labelId = $derived(`${switchId}-label`);

	function handleClick() {
		if (disabled) return;

		const nextValue: 'on' | 'off' = checked ? 'off' : 'on';
		value = nextValue;
		onchange?.(nextValue);
	}
</script>

<div class="atl-toggle-switch" class:atl-toggle-switch--disabled={disabled}>
	{#if label}
		<div id={labelId}>
			<AtlLabel
				id={switchId}
				{label}
				{description}
				{disabled}
				{visuallyHidden}
			/>
		</div>
	{/if}

	<button
		type="button"
		id={switchId}
		class="atl-toggle-switch__control"
		role="switch"
		aria-checked={checked}
		aria-labelledby={label ? labelId : undefined}
		onclick={handleClick}
		{disabled}
	></button>
</div>

<style>
	.atl-toggle-switch {
		display: flex;
		align-items: center;
		gap: var(--spacing-8);
	}

	.atl-toggle-switch__control {
		position: relative;
		box-sizing: border-box;
		width: var(--size-40);
		height: var(--size-20);
		padding: 0;
		background-color: var(--bgn-surface);
		border: var(--border-width-1) solid var(--border-color-base);
		border-radius: var(--border-radius-16);
		cursor: var(--cursor-pointer);
		flex-shrink: 0;
		transition: background-color 0.2s ease, border-color 0.2s ease;

		&::before {
			content: '';
			position: absolute;
			width: var(--size-16);
			height: var(--size-16);
			inset-block-start: 50%;
			inset-inline-start: var(--border-width-1);
			background-color: var(--color-base);
			border-radius: 50%;
			transform: translateY(-50%);
			transition: transform 0.2s ease, background-color 0.2s ease;
		}

		&:hover:not(:disabled) {
			background-color: var(--bgn-surface-hover);
		}

		&:focus-visible {
			outline: var(--border-width-2) solid var(--border-color-focus);
			outline-offset: var(--border-width-2);
		}

		&[aria-checked='true'] {
			background-color: var(--bgn-accent);
			border-color: var(--border-color-accent);

			&:hover:not(:disabled) {
				background-color: var(--bgn-accent-hover);
				border-color: var(--bgn-accent-hover);
			}

			&::before {
				background-color: var(--color-inverse);
				transform: translateY(-50%) translateX(var(--size-20));
			}
		}

		&:disabled {
			background-color: var(--bgn-disable);
			border-color: var(--border-color-disable);
			cursor: var(--cursor-not-allowed);

			&::before {
				background-color: var(--color-inverse);
			}
		}
	}

	:global([dir='rtl']) .atl-toggle-switch__control[aria-checked='true']::before {
		transform: translateY(-50%) translateX(calc(-1 * var(--size-20)));
	}
</style>
