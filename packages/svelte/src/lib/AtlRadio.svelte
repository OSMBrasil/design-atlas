<script lang="ts">
	import AtlLabel from './AtlLabel.svelte';

	interface RadioOption {
		key: string;
		text: string;
		description?: string;
		disabled?: boolean;
	}

	// Radio group props
	export let options: RadioOption[] = [];
	export let value: string = '';
	export let name = `radio-${Math.random().toString(36).slice(2)}`;
	export let disabled: boolean = false;

	// Label props (shared with select)
	export let id: string = '';
	export let label: string = 'Label';
	export let optional: boolean = false;
	export let visuallyHidden: boolean = false;
	export let isLegend: boolean = true;
	export let required: boolean = false;
	export let description: string = '';
</script>

<fieldset class="atl-radio-group" {disabled}>
	{#if label}
		<AtlLabel
			{id}
			{label}
			{optional}
			{visuallyHidden}
			isLegend={isLegend}
			{required}
			{description}
			{disabled}
		/>
	{/if}

	<div class="atl-radio-options">
		{#each options as option}
			<label class="atl-radio" class:disabled={disabled || option.disabled}>
				<input
					type="radio"
					{name}
					value={option.key}
					bind:group={value}
					disabled={disabled || option.disabled}
				/>
				<span class="atl-radio-content">
					<span class="atl-radio-text">{option.text}</span>
					{#if option.description}
						<span class="atl-radio-description">{option.description}</span>
					{/if}
				</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.atl-radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
		border: 0;
		padding: 0;
		margin: 0;
		min-inline-size: 0;
		font-family: var(--font-family-sans-serif);
	}

	.atl-radio-options {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--spacing-16);
	}

	.atl-radio {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-8);
		cursor: var(--cursor-pointer);

		&.disabled {
			cursor: var(--cursor-not-allowed);
		}

		& input[type='radio'] {
			appearance: none;
			width: var(--size-16);
			height: var(--size-16);
			border: var(--border-width-2) solid var(--border-color-base);
			border-radius: 50%;
			background-color: var(--color-inverse);
			cursor: var(--cursor-pointer);
			margin: 2px 0 0 0;
			flex-shrink: 0;
			box-sizing: border-box;
			transition: border-width 0.15s ease, border-color 0.15s ease;
		}

		& input[type='radio']:hover:not(:checked):not(:disabled) {
			border-color: var(--border-color-accent);
			background-color: var(--bgn-foreground);
		}

		& input[type='radio']:checked:not(:disabled) {
			border-color: var(--color-accent);
			border-width: 5px;
		}

		& input[type='radio']:checked:hover:not(:disabled) {
			border-color: var(--color-accent-hover);
		}

		& input[type='radio']:focus-visible {
			outline: 2px solid var(--border-color-focus);
			outline-offset: 2px;
		}

		& input[type='radio']:disabled {
			cursor: var(--cursor-not-allowed);
			background-color: var(--bgn-disable);
			border-color: var(--border-color-base);
		}

		& input[type='radio']:disabled:checked {
			background-color: var(--color-base);
			border-width: 4px;
			border-color: var(--bgn-disable);
			box-shadow: 0 0 0 1px var(--border-color-base);
		}
	}

	.atl-radio-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.atl-radio-text {
		font-size: var(--font-size-16);
		font-weight: var(--font-weight-regular);
		line-height: var(--line-height-label);
		color: var(--color-base);
	}

	.atl-radio-description {
		font-size: var(--font-size-12);
		line-height: var(--line-height-label);
		color: var(--color-subtle);
	}
</style>
