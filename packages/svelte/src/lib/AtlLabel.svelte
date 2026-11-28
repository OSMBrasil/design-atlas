<script>
	import AtlIcon from './AtlIcon.svelte';
	import { getAtlLocale } from './i18n/messages.js';

	const atlLocale = getAtlLocale();

	export let id = '';
	export let label = 'Label';
	export let icon = '';
	export let optional = false;
	export let optionalLabel = '';
	export let visuallyHidden = false;
	export let isLegend = false;
	export let disabled = false;
	export let required = false;
	export let description = '';

	$: resolvedOptionalLabel = optionalLabel || atlLocale.messages.label.optional;
</script>

{#if isLegend}
	<legend class="atl-label {disabled ? 'disabled' : ''} {visuallyHidden ? 'sr-only' : ''}">
		{#if icon}
			<span class="icon"><AtlIcon {icon} size="1rem" /></span>
		{/if}
		{label}
		{#if required}
			<span aria-hidden="true" class="required">*</span>
		{/if}
		{#if optional}
			<span class="optional">{resolvedOptionalLabel}</span>
		{/if}

		{#if description}
			<div class="description">{description}</div>
		{/if}
	</legend>
{:else}
	<div class="atl-label {disabled ? 'disabled' : ''}">
		<label for={id} class:sr-only={visuallyHidden}>
			{#if icon}
				<span class="icon"><AtlIcon {icon} size="1rem" /></span>
			{/if}
			{label}

			{#if required}
				<span aria-hidden="true" class="required">*</span>
			{/if}

			{#if optional}
				<span class="optional">{resolvedOptionalLabel}</span>
			{/if}
		</label>

		{#if description}
			<div class="description">{description}</div>
		{/if}
	</div>
{/if}

<style>
	.atl-label {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: fit-content;
		color: var(--color-emphasized);
	}

	.atl-label.disabled {
		opacity: var(--opacity-50);
		cursor: not-allowed;
	}

	label,
	legend {
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-16);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.required {
		color: var(--red-500);
		margin-inline-start: 2px;
	}

	.optional {
		color: var(--color-subtle);
		font-weight: var(--font-weight-regular);
		margin-inline-start: 4px;
	}

	.description {
		font-size: var(--font-size-12);
		color: var(--color-subtle);
	}

	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
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
