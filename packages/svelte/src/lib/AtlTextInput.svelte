<script>
	import { infoFill, checkCircleFill, warningFill, reportFill, close as closeIcon, person } from '@design-atlas/ms-icons';
	import AtlIcon from './AtlIcon.svelte';
	import { getAtlLocale } from './i18n/messages.js';

	const atlLocale = getAtlLocale();

	export let startIcon = '';
	export let endIcon = '';
	export let clearable = false;
	export let clearButtonLabel = '';
	export let inputType = 'text';
	export let status = 'default'; // "default", "error", "success"
	export let disabled = false;
	export let readonly = false;
	export let placeholder = 'Placeholder';
	export let value = '';

	$: resolvedClearLabel = clearButtonLabel || atlLocale.messages.textInput.clear;

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

<div class="atl-field {status}">
	{#if resolvedStartIcon}
		<span class="icon left">
			<AtlIcon icon={resolvedStartIcon} size="20px" />
		</span>
	{/if}

	<input
		type={inputType}
		bind:value
		on:input={handleInput}
		class:success={isSuccess}
		class:error={isError}
		{placeholder}
		{disabled}
		{readonly}
		style="padding-inline-start: {resolvedStartIcon ? '36px' : '12px'}; padding-inline-end: {resolvedEndIcon || clearable
			? '36px'
			: '12px'};"
	/>
	{#if clearable && value && !readonly && !disabled}
		<button class="clear-button" type="button" on:click={clearInput} aria-label={resolvedClearLabel}>
			<AtlIcon icon={closeIcon} size="20px" />
		</button>
	{/if}

	{#if resolvedEndIcon}
		<span class="icon right end-icon">
			<AtlIcon icon={resolvedEndIcon} size="20px" />
		</span>
	{/if}
</div>

<style>
	.atl-field {
		position: relative;
		display: inline-flex;
		align-items: center;
		width: 100%;
		max-width: var(--size-416);
		height: var(--size-40);
	}

	input {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: var(--border-width-1) solid var(--border-color-base);
		border-radius: var(--border-radius-4);
		background-color: transparent;
		font-size: var(--font-size-16);
		line-height: var(--line-height-label);
		padding-inline-start: 12px;
		padding-inline-end: 12px;

		&:focus {
			border-color: var(--border-color-focus);
		}
	}
	input:not(:disabled):not(:read-only):hover {
		border-color: var(--border-color-accent);
	}
	input:disabled {
		background: var(--bgn-base);
		cursor: not-allowed;
	}

	input.success {
		border-color: var(--border-color-success);
	}

	input.error {
		border-color: var(--border-color-error);
	}

	.atl-field:has(input:disabled) .icon {
		opacity: var(--opacity-30);
	}
	.atl-field:has(input:read-only) .icon {
		opacity: var(--opacity-50);
	}
	.icon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		pointer-events: none;
	}

	.icon.left {
		inset-inline-start: var(--spacing-8);
	}

	.icon.right {
		inset-inline-end: var(--spacing-8);
		pointer-events: auto;
	}
	.clear-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		inset-inline-end: var(--spacing-12);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		z-index: 1;
	}

	.clear-button:hover {
		opacity: var(--opacity-80);
	}

	.icon.right.end-icon {
		inset-inline-end: var(--spacing-8);
	}
	:focus {
    outline: none;
	}
</style>
