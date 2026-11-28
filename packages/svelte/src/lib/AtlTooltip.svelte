<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let tooltipVisible: boolean = false;

	const tooltipId: string = `atl-tooltip-${Math.random().toString(36).slice(2, 8)}`;

	let isTouch: boolean = false;

	export let text: string = '';
	/** Physical placement direction (`left` and `right` are physical and do not flip in RTL). */
	export let direction:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end'
		| 'right'
		| 'right-start'
		| 'right-end' = 'bottom';

	let triggerEl: HTMLElement | undefined;

	function showTooltip() {
		tooltipVisible = true;
	}

	function hideTooltip() {
		tooltipVisible = false;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			hideTooltip();
		}
	}

	function onDocumentClick(event: MouseEvent) {
		if (triggerEl && !triggerEl.contains(event.target as Node)) {
			hideTooltip();
		}
	}

	function handleTouchStart() {
		isTouch = true;
		showTooltip();
	}

	function handleTouchEnd() {
		isTouch = false;
	}

	function handleMouseEnter() {
		if (!isTouch) showTooltip();
	}

	function handleMouseLeave() {
		if (!isTouch) hideTooltip();
	}

	function handleFocus() {
		if (!isTouch) showTooltip();
	}

	function handleBlur() {
		if (!isTouch) hideTooltip();
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener('keydown', onKeyDown);
			document.addEventListener('click', onDocumentClick);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('click', onDocumentClick);
		}
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="atl-tooltip" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<span
		class="atl-tooltip__trigger"
		bind:this={triggerEl}
		on:focusin={handleFocus}
		on:focusout={handleBlur}
		on:touchstart={handleTouchStart}
		on:touchend={handleTouchEnd}
		aria-describedby={tooltipVisible && text ? tooltipId : undefined}
		tabindex="0"
	>
		<slot />
	</span>

	{#if tooltipVisible && text}
		<span id={tooltipId} role="tooltip" class="atl-tooltip__content atl-tooltip__content--{direction}">
			{text}
		</span>
	{/if}
</div>

<style>
	.atl-tooltip {
		position: relative;
		display: inline-block;

		& .atl-tooltip__trigger {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			cursor: var(--cursor-pointer);
			border-radius: var(--border-radius-4);

			&:focus-visible {
				outline: 2px solid var(--border-color-focus);
				outline-offset: 2px;
			}
		}

		& .atl-tooltip__content {
			position: absolute;
			z-index: 10;
			width: max-content;
			max-width: var(--dimension-240);
			padding: var(--spacing-8) var(--spacing-4);
			background-color: var(--color-base);
			color: var(--color-inverse);
			font-family: var(--font-family-sans-serif);
			font-size: var(--font-size-12);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-paragraph);
			white-space: normal;
			word-wrap: break-word;
			border-radius: var(--border-radius-4);
			opacity: var(--opacity-100);
			transition: opacity 0.2s ease;
			pointer-events: auto;

			&.atl-tooltip__content--top {
				bottom: 100%;
				left: 50%;
				transform: translateX(-50%) translateY(calc(-1 * var(--spacing-8)));
			}

			&.atl-tooltip__content--top-start {
				bottom: 100%;
				left: 0;
				transform: translateY(calc(-1 * var(--spacing-8)));
			}

			&.atl-tooltip__content--top-end {
				bottom: 100%;
				right: 0;
				transform: translateY(calc(-1 * var(--spacing-8)));
			}

			&.atl-tooltip__content--bottom {
				top: 100%;
				left: 50%;
				transform: translateX(-50%) translateY(var(--spacing-8));
			}

			&.atl-tooltip__content--bottom-start {
				top: 100%;
				left: 0;
				transform: translateY(var(--spacing-8));
			}

			&.atl-tooltip__content--bottom-end {
				top: 100%;
				right: 0;
				transform: translateY(var(--spacing-8));
			}

			&.atl-tooltip__content--left {
				top: 50%;
				right: 100%;
				transform: translateY(-50%) translateX(calc(-1 * var(--spacing-8)));
			}

			&.atl-tooltip__content--left-start {
				top: 0;
				right: 100%;
				transform: translateX(calc(-1 * var(--spacing-8)));
			}

			&.atl-tooltip__content--left-end {
				bottom: 0;
				right: 100%;
				transform: translateX(calc(-1 * var(--spacing-8)));
			}

			&.atl-tooltip__content--right {
				top: 50%;
				left: 100%;
				transform: translateY(-50%) translateX(var(--spacing-8));
			}

			&.atl-tooltip__content--right-start {
				top: 0;
				left: 100%;
				transform: translateX(var(--spacing-8));
			}

			&.atl-tooltip__content--right-end {
				bottom: 0;
				left: 100%;
				transform: translateX(var(--spacing-8));
			}
		}
	}
</style>
