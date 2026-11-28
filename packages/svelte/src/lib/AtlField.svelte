<script context="module">
	let fieldCounter = 0;
</script>

<script>
	import AtlAlert from './AtlAlert.svelte';
	import AtlLabel from './AtlLabel.svelte';
	import AtlTextInput from './AtlTextInput.svelte';

	// Identifier
	export let id = '';

	// Label
	export let label = '';
	export let labelIcon = '';
	export let labelDescription = '';
	export let optional = false;
	export let optionalLabel = '';
	export let hideLabel = false;
	export let isFieldset = false;
	export let disabled = false;
	export let required = false;

	// Alert
	export let inlineAlert = false;
	export let status = 'default'; // 'default' | 'error' | 'warning' | 'success'
	export let alertMessage = 'Alert Message';

	// TextInput props
	export let startIcon = '';
	export let endIcon = '';
	export let clearable = true;
	export let inputType = 'text';
	export let readonly = false;
	export let placeholder = 'Placeholder';
	export let value = '';

	const fallbackId = `atl-field-${++fieldCounter}`;
	$: fieldId = id || fallbackId;
	$: showInlineAlert = inlineAlert && ['error', 'warning', 'success'].includes(status);
	$: descriptionId = labelDescription ? `${fieldId}-description` : '';
	$: alertId = showInlineAlert ? `${fieldId}-alert` : '';
	$: describedBy = [descriptionId, alertId].filter(Boolean).join(' ') || undefined;
</script>

{#if isFieldset}
	<fieldset class="atl-fieldset" class:disabled {disabled}>
		{#if label}
			<AtlLabel
				inputId={fieldId}
				{descriptionId}
				{label}
				icon={labelIcon}
				description={labelDescription}
				{optional}
				{optionalLabel}
				{required}
				{disabled}
				isLegend={true}
				visuallyHidden={hideLabel}
			/>
		{/if}

		<slot {fieldId} {describedBy}>
			<AtlTextInput
				id={fieldId}
				{startIcon}
				{endIcon}
				{clearable}
				{inputType}
				{status}
				{disabled}
				{readonly}
				{required}
				{placeholder}
				ariaDescribedby={describedBy}
				bind:value
			/>
		</slot>

		{#if showInlineAlert}
			<div id={alertId} class="atl-field__alert">
				<AtlAlert type="inline" state={status} title={false}>
					{alertMessage}
				</AtlAlert>
			</div>
		{/if}
	</fieldset>
{:else}
	<div class="atl-field" class:disabled>
		{#if label}
			<AtlLabel
				inputId={fieldId}
				{descriptionId}
				{label}
				icon={labelIcon}
				description={labelDescription}
				{optional}
				{optionalLabel}
				{required}
				{disabled}
				isLegend={false}
				visuallyHidden={hideLabel}
			/>
		{/if}

		<slot {fieldId} {describedBy}>
			<AtlTextInput
				id={fieldId}
				{startIcon}
				{endIcon}
				{clearable}
				{inputType}
				{status}
				{disabled}
				{readonly}
				{required}
				{placeholder}
				ariaDescribedby={describedBy}
				bind:value
			/>
		</slot>

		{#if showInlineAlert}
			<div id={alertId} class="atl-field__alert">
				<AtlAlert type="inline" state={status} title={false}>
					{alertMessage}
				</AtlAlert>
			</div>
		{/if}
	</div>
{/if}

<style>
	.atl-field,
	.atl-fieldset {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
		width: 100%;
		min-width: var(--size-272);
		max-width: var(--size-416);
		border: none;
		padding: 0;
		margin: 0;

		&.disabled,
		&:disabled {
			opacity: var(--opacity-50);
			pointer-events: none;
		}
	}
</style>
