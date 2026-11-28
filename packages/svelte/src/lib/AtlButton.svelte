<script>
	export let type = 'button';
	export let disabled = false;
	export let variant = '';
	export let withIcon = false;
	export let children;
</script>

<button
	{...$$restProps}
	class={[
		'atl-button',
		variant,
		withIcon && 'with-icon',
		disabled && 'disabled',
		$$restProps.class
	]
		.filter(Boolean)
		.join(' ')}
	{type}
	{disabled}
	on:click
>
	{@render children?.()}
</button>

<style>
	.atl-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		background-color: var(--bgn-accent);
		color: var(--color-inverse);
		padding: var(--spacing-8) var(--spacing-32);
		border: none;
		gap: var(--spacing-4);
		border-radius: var(--border-radius-4);
		font-family: var(--font-family-sans-serif);
		font-weight: var(--font-weight-regular);
		font-size: var(--font-size-16);
		line-height: var(--line-height-label);
		cursor: var(--cursor-pointer);
		height: var(--dimension-36);
		flex-shrink: 0;

		&:hover {
			background-color: var(--bgn-accent-hover);
		}

		&:active {
			background-color: var(--bgn-accent-active);
		}

		&:focus-visible {
			outline: 2px solid var(--border-color-focus);
			outline-offset: 2px;
		}

		&.danger {
			background-color: var(--bgn-danger);

			&:hover {
				background-color: var(--bgn-danger-hover);
			}

			&:active {
				background-color: var(--bgn-danger-active);
			}
		}

		&.tertiary {
			padding: var(--spacing-8) var(--spacing-16);
			color: var(--color-base);
			background-color: transparent;
			font-weight: var(--font-weight-semibold, 600);

			&:hover {
				background-color: var(--bgn-surface-hover);
				color: var(--color-base-hover);
			}

			&:active {
				background-color: var(--bgn-surface-hover);
				color: var(--color-base-hover);
			}
		}

		&.outline {
			background-color: transparent;
			border: var(--border-style-accent);
			font-weight: var(--font-weight-semibold, 600);
			color: var(--color-accent);

			&:hover {
				background-color: var(--bgn-accent);
				color: var(--color-inverse);
			}

			&:active {
				background-color: var(--bgn-accent-active);
				color: var(--color-inverse);
			}
		}

		&.with-icon {
			padding: var(--spacing-8) var(--spacing-24);
		}

		&:disabled,
		&.disabled {
			background-color: var(--bgn-disable);
			color: var(--color-disable);
			cursor: var(--cursor-not-allowed);
			pointer-events: none;
		}

		&.outline:disabled,
		&.outline.disabled {
			background-color: transparent;
			border-color: var(--border-color-disable);
			color: var(--color-disable);
		}

		&.tertiary:disabled,
		&.tertiary.disabled {
			background-color: transparent;
			color: var(--color-disable);
		}
	}
</style>