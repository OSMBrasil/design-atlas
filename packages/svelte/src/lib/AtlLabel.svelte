<script>
	import AtlIcon from './AtlIcon.svelte';
	import { getAtlLocale } from './i18n/messages.js';

	const atlLocale = getAtlLocale();

	export let id = '';
	export let inputId = '';
	export let descriptionId = '';
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
	$: resolvedFor = inputId || id || undefined;
</script>

{#if isLegend}
	<legend class="atl-label" class:disabled class:sr-only={visuallyHidden}>
		<span class="atl-label__text">
			{#if icon}
				<span class="atl-label__icon" aria-hidden="true"><AtlIcon {icon} size="1rem" /></span>
			{/if}
			<slot>{label}</slot>
			{#if required}
				<span aria-hidden="true" class="atl-label__required">*</span>
			{/if}
			{#if optional}
				<span class="atl-label__optional">{resolvedOptionalLabel}</span>
			{/if}
		</span>

		{#if description}
			<span id={descriptionId || undefined} class="atl-label__description">{description}</span>
		{/if}
	</legend>
{:else}
	<div class="atl-label" class:disabled class:sr-only={visuallyHidden}>
		<label class="atl-label__text" for={resolvedFor}>
			{#if icon}
				<span class="atl-label__icon" aria-hidden="true"><AtlIcon {icon} size="1rem" /></span>
			{/if}
			<slot>{label}</slot>
			{#if required}
				<span aria-hidden="true" class="atl-label__required">*</span>
			{/if}
			{#if optional}
				<span class="atl-label__optional">{resolvedOptionalLabel}</span>
			{/if}
		</label>

		{#if description}
			<div id={descriptionId || undefined} class="atl-label__description">{description}</div>
		{/if}
	</div>
{/if}

<style>
	.atl-label {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
		width: fit-content;
		color: var(--color-emphasized);
		padding: 0;
		margin: 0;
		border: 0;

		&.disabled {
			opacity: var(--opacity-50);
			cursor: not-allowed;
		}

		&.sr-only {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			clip-path: inset(50%);
			border: 0;
			white-space: nowrap;
		}

		& .atl-label__text {
			display: inline-flex;
			align-items: center;
			gap: var(--spacing-4);
			font-size: var(--font-size-16);
			font-weight: var(--font-weight-semibold);
			line-height: var(--line-height-label);
			color: var(--color-emphasized);
		}

		& .atl-label__icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: var(--size-16);
			height: var(--size-16);
			flex-shrink: 0;
		}

		& .atl-label__required {
			color: var(--color-error);
			margin-inline-start: var(--spacing-4);
		}

		& .atl-label__optional {
			color: var(--color-base);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-label);
			margin-inline-start: var(--spacing-4);
		}

		& .atl-label__description {
			font-size: var(--font-size-12);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-paragraph);
			color: var(--color-base);
		}
	}
</style>
