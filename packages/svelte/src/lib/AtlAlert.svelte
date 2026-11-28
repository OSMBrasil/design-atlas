<script>
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { infoFill, checkCircleFill, warningFill, reportFill, close as closeIcon } from '@design-atlas/ms-icons';
	import AtlIcon from './AtlIcon.svelte';
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

	const stateIcons = {
		info: infoFill,
		success: checkCircleFill,
		warning: warningFill,
		error: reportFill
	};

	$: isInline = type === 'inline';
	$: activeIcon = stateIcons[state] || infoFill;
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
		<div class="atl-alert-icon color-{state}" aria-hidden="true">
			<AtlIcon icon={activeIcon} size={isInline ? '20px' : '24px'} />
		</div>
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
			>
				<AtlIcon icon={closeIcon} size="20px" />
			</button>
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
