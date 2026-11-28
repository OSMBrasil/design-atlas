<script>
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getAtlLocale } from './i18n/messages.js';

	const atlLocale = getAtlLocale();

	export let type = 'box'; // 'box' | 'inline'
	export let state = 'info'; // 'info' | 'warning' | 'error' | 'success'
	export let close = false;
	export let dismissButtonLabel = '';
	export let title = true;
	export let titleText = 'Title';
	export let fadeIn = false;
	export let autoDismiss = false; // boolean | number (ms)

	$: resolvedDismissLabel = dismissButtonLabel || atlLocale.messages.alert.dismiss;

	let visible = true;
	let dismissTimer;

	const icons = {
		info: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`,
		success: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`,
		warning: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m40-120 440-760 440 760H40Zm440-120q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Z"/></svg>`,
		error: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-79q-16 0-30.5-6T423-102L102-423q-11-12-17-26.5T79-480q0-16 6-31t17-26l321-321q12-12 26.5-17.5T480-881q16 0 31 5.5t26 17.5l321 321q12 11 17.5 26t5.5 31q0 16-5.5 30.5T858-423L537-102q-11 11-26 17t-31 6Zm-40-361h80v-240h-80v240Zm40 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Z"/></svg>`,
		close: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`
	};

	$: isInline = type === 'inline';
	$: iconMarkup = icons[state] || '';
	$: showTitle = !isInline && title;
	$: canDismiss = close && !isInline;
	$: variantClasses = isInline
		? state === 'success' || state === 'error'
			? `color-${state}`
			: 'color-base'
		: `bgn-${state} border-color-${state}`;

	$: {
		clearTimeout(dismissTimer);
		if (visible && autoDismiss && state !== 'error') {
			const delay = typeof autoDismiss === 'number' ? autoDismiss : 4000;
			dismissTimer = setTimeout(() => {
				visible = false;
			}, delay);
		}
	}

	function handleClose() {
		clearTimeout(dismissTimer);
		visible = false;
	}

	function innerHTML(node, value) {
		node.innerHTML = value;
		return {
			update(nextValue) {
				node.innerHTML = nextValue;
			}
		};
	}

	onDestroy(() => {
		clearTimeout(dismissTimer);
	});
</script>

{#if visible}
	<div
		class="atl-alert {state} {type} {variantClasses}"
		class:has-close={canDismiss}
		role="alert"
		transition:fade={{ duration: fadeIn ? 200 : 0 }}
	>
		<div
			class="atl-alert-icon color-{state}"
			aria-hidden="true"
			use:innerHTML={iconMarkup}
		></div>
		<div class="atl-alert-content">
			{#if showTitle}
				<div class="atl-alert-title semibold color-base">{titleText}</div>
			{/if}
			<div
				class="atl-alert-children-content {isInline ? 'body-sm bold' : 'body-md color-base'}"
			>
				<slot />
			</div>
		</div>

		{#if canDismiss}
			<button
				type="button"
				class="atl-alert-close color-subtle"
				aria-label={resolvedDismissLabel}
				on:click={handleClose}
				use:innerHTML={icons.close}
			></button>
		{/if}
	</div>
{/if}

<style>
	.atl-alert {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		max-width: 488px;
		gap: var(--spacing-4);
		border-radius: var(--border-radius-4);
		padding-block: var(--spacing-16);
		padding-inline-start: var(--spacing-8);
		padding-inline-end: var(--spacing-16);
		border-width: var(--border-width-1);
		border-style: solid;
		box-sizing: border-box;

		&.has-close {
			padding-inline-end: var(--spacing-32);
		}

		& .atl-alert-icon {
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		& .atl-alert-content {
			display: flex;
			flex-direction: column;
			flex: 1;
			gap: var(--spacing-4);
			padding-top: 2px;
		}

		& .atl-alert-title {
			font-size: var(--font-size-16);
			line-height: 1.4;
		}

		& .atl-alert-children-content {
			line-height: 1.25;
		}

		& .atl-alert-close {
			position: absolute;
			inset-block-start: var(--spacing-4);
			inset-inline-end: var(--spacing-4);
			width: var(--size-24, 24px);
			height: var(--size-24, 24px);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			background: none;
			border: none;
			cursor: pointer;
		}

		&.inline {
			width: auto;
			max-width: none;
			padding: 0;
			border-color: transparent;
			background: none;
			align-items: center;

			& .atl-alert-icon {
				width: 20px;
				height: 20px;
			}

			& .atl-alert-content {
				width: auto;
				padding-top: 0;
				flex-direction: row;
				align-items: center;
			}

			/* Inherit color-{state} from .atl-alert.inline so it is not overridden by .body-sm { color: var(--color-base) } */
			& .atl-alert-children-content {
				color: inherit;
				line-height: 1.4;
			}
		}
	}
</style>
