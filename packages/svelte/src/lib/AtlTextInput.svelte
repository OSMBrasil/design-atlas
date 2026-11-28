<script>
	import {
		infoFill,
		checkCircleFill,
		warningFill,
		reportFill,
		close as closeIcon,
		person
	} from '@design-atlas/ms-icons';
	import AtlIcon from './AtlIcon.svelte';
	import { getAtlLocale } from './i18n/messages.js';

	const atlLocale = getAtlLocale();

	export let id = '';
	export let name = '';
	export let startIcon = '';
	export let endIcon = '';
	export let clearable = false;
	export let clearButtonLabel = '';
	export let inputType = 'text';
	export let status = 'default'; // 'default' | 'error' | 'success'
	export let disabled = false;
	export let readonly = false;
	export let required = false;
	export let placeholder = 'Placeholder';
	export let value = '';
	export let ariaDescribedby = '';

	$: resolvedClearLabel = clearButtonLabel || atlLocale.messages.textInput.clear;
	$: describedBy = $$restProps['aria-describedby'] || ariaDescribedby || undefined;

	const namedIcons = {
		info: infoFill,
		success: checkCircleFill,
		warning: warningFill,
		error: reportFill,
		close: closeIcon,
		person
	};

	function resolveInputIcon(val) {
		if (!val) return null;
		if (typeof val === 'string' && namedIcons[val]) return namedIcons[val];
		return val;
	}

	$: resolvedStartIcon = resolveInputIcon(startIcon);
	$: resolvedEndIcon = resolveInputIcon(endIcon);
	$: isSuccess = status === 'success';
	$: isError = status === 'error';

	function handleInput(event) {
		value = event.target.value;
	}

	function clearInput() {
		value = '';
	}
</script>

<div
	class="atl-text-input {status}"
	class:success={isSuccess}
	class:error={isError}
	class:disabled
	class:readonly
>
	{#if resolvedStartIcon}
		<span class="atl-text-input__icon atl-text-input__icon--start" aria-hidden="true">
			<AtlIcon icon={resolvedStartIcon} size="20px" />
		</span>
	{/if}

	<input
		{...$$restProps}
		id={id || undefined}
		name={name || undefined}
		type={inputType}
		class="atl-text-input__input"
		{value}
		on:input={handleInput}
		{placeholder}
		{disabled}
		{readonly}
		{required}
		aria-invalid={isError || undefined}
		aria-describedby={describedBy}
	/>

	{#if clearable && value && !readonly && !disabled}
		<button
			class="atl-text-input__clear"
			type="button"
			on:click={clearInput}
			aria-label={resolvedClearLabel}
		>
			<AtlIcon icon={closeIcon} size="20px" />
		</button>
	{/if}

	{#if resolvedEndIcon}
		<span class="atl-text-input__icon atl-text-input__icon--end" aria-hidden="true">
			<AtlIcon icon={resolvedEndIcon} size="20px" />
		</span>
	{/if}
</div>

<style>
	.atl-text-input {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-8);
		width: 100%;
		max-width: var(--size-416);
		height: var(--size-40);
		padding-inline: var(--spacing-12);
		box-sizing: border-box;
		border: var(--border-width-1) solid var(--border-color-base);
		border-radius: var(--border-radius-4);
		background-color: transparent;
		transition: border-color 0.2s;

		&:not(.disabled):not(.readonly):not(.success):not(.error):hover {
			border-color: var(--border-color-accent);
		}

		&:focus-within:not(.disabled) {
			border-color: var(--border-color-focus);
			outline: 2px solid var(--border-color-focus);
			outline-offset: -1px;
		}

		&.success {
			border-color: var(--border-color-success);
		}

		&.error {
			border-color: var(--border-color-error);
		}

		&.disabled {
			background-color: var(--bgn-base);
			cursor: not-allowed;

			& .atl-text-input__input {
				cursor: not-allowed;
			}

			& .atl-text-input__icon {
				opacity: var(--opacity-30);
			}
		}

		&.readonly {
			& .atl-text-input__icon {
				opacity: var(--opacity-50);
			}
		}

		& .atl-text-input__input {
			flex: 1 1 auto;
			min-width: 0;
			width: 100%;
			height: 100%;
			padding: 0;
			border: none;
			background: transparent;
			font-family: var(--font-family-sans-serif);
			font-size: var(--font-size-16);
			line-height: var(--line-height-label);
			color: var(--color-base-hover);
			outline: none;

			&::placeholder {
				color: var(--color-disable);
			}
		}

		& .atl-text-input__icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			width: var(--size-24);
			height: var(--size-24);
			color: var(--color-base);
			pointer-events: none;
		}

		& .atl-text-input__clear {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			width: var(--size-24);
			height: var(--size-24);
			padding: 0;
			border: none;
			border-radius: var(--border-radius-4);
			background: transparent;
			color: var(--color-base);
			cursor: pointer;

			&:hover {
				opacity: var(--opacity-80);
			}

			&:focus-visible {
				outline: 2px solid var(--border-color-focus);
				outline-offset: 1px;
			}
		}
	}
</style>
