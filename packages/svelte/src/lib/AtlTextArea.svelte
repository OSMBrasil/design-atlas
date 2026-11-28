<script context="module" lang="ts">
	let textareaCounter = 0;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import AtlLabel from './AtlLabel.svelte';

	type Status = 'default' | 'success' | 'error';
	type Resize = 'none' | 'vertical' | 'horizontal' | 'both';

	export let value: string = '';
	export let placeholder: string = 'Placeholder';
	export let disabled: boolean = false;
	export let readonly: boolean = false;
	export let status: Status = 'default';
	export let resizable: boolean = true;
	export let resize: Resize = 'both';
	export let rows: number = 3;
	export let width: number | undefined = undefined;
	export let height: number = 208;
	export let autosize: boolean = false;
	export let useRowsHeight: boolean = true; // If false, use pixels height

	// Label props
	export let id: string = '';
	export let label: string = 'Label';
	export let optional: boolean = false;
	export let visuallyHidden: boolean = false;
	export let isLegend: boolean = false;
	export let required: boolean = false;
	export let description: string = '';

	let textareaEl: HTMLTextAreaElement;
	let baseHeight: number = 0;

	const fallbackId = `atl-textarea-${++textareaCounter}`;
	$: textareaId = id || fallbackId;
	$: descriptionId = description ? `${textareaId}-description` : '';
	$: isSuccess = status === 'success';
	$: isError = status === 'error';

	function calculateBaseHeight() {
		if (!textareaEl) return;
		const currentValue = textareaEl.value;
		textareaEl.value = '';
		textareaEl.style.height = 'auto';

		const testText = Array(rows).fill('A').join('\n');
		textareaEl.value = testText;

		baseHeight = textareaEl.scrollHeight;

		textareaEl.value = currentValue;
	}

	function resizeToFit() {
		if (!textareaEl) return;

		if (autosize) {
			textareaEl.style.height = 'auto';
			const newHeight = Math.max(textareaEl.scrollHeight, baseHeight);
			textareaEl.style.height = `${newHeight}px`;
		} else {
			// If autosize is false, use rows height
			textareaEl.style.height = `${baseHeight}px`;
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		if (autosize) {
			resizeToFit();
		}
	}

	onMount(() => {
		if (useRowsHeight) {
			calculateBaseHeight();
			resizeToFit();
		}
	});

	$: if (textareaEl && rows && useRowsHeight) {
		calculateBaseHeight();
		resizeToFit();
	}
</script>

<div class="atl-textarea {status}">
	{#if label}
		<AtlLabel
			inputId={textareaId}
			{descriptionId}
			{label}
			{optional}
			{visuallyHidden}
			{isLegend}
			{required}
			{disabled}
			{description}
		/>
	{/if}

	<textarea
		{...$$restProps}
		id={textareaId}
		class="atl-textarea__input"
		class:success={isSuccess}
		class:error={isError}
		class:autosize
		bind:this={textareaEl}
		bind:value
		{placeholder}
		{disabled}
		{readonly}
		{required}
		{rows}
		aria-invalid={isError || undefined}
		aria-describedby={descriptionId || undefined}
		on:input={handleInput}
		style="
			resize: {autosize ? 'vertical' : resizable ? resize : 'none'};
			{width ? `max-width: ${width}px;` : ''}
			{useRowsHeight
				? (autosize ? 'height: auto;' : baseHeight ? `height: ${baseHeight}px;` : '') +
					(autosize && baseHeight ? ` min-height: ${baseHeight}px;` : '')
				: autosize
					? 'height: auto;'
					: `height: ${height}px;`}
		"
	></textarea>
</div>

<style>
	.atl-textarea {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
		width: 100%;
		max-width: var(--size-416);

		& .atl-textarea__input {
			box-sizing: border-box;
			width: 100%;
			max-width: var(--size-416);
			border: var(--border-width-1) solid var(--border-color-base);
			border-radius: var(--border-radius-4);
			background-color: transparent;
			color: var(--color-base-hover);
			font-size: var(--font-size-16);
			font-family: var(--font-family-sans-serif);
			line-height: var(--line-height-label);
			padding: var(--spacing-8) var(--spacing-12);
			transition: border-color 0.2s;
			overflow-y: auto;

			&::placeholder {
				color: var(--color-disable);
			}

			&.autosize {
				overflow-y: hidden;
			}

			&:not(:disabled):not(:read-only):not(.success):not(.error):hover {
				border-color: var(--border-color-accent);
			}

			&:focus {
				border-color: var(--border-color-focus);
				outline: none;
			}

			&:focus-visible {
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

			&:disabled {
				background: var(--bgn-base);
				cursor: not-allowed;
			}
		}
	}
</style>
