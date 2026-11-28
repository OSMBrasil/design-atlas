<script lang="ts">
	import { icons, type IconDefinition } from '@design-atlas/ms-icons';

	/**
	 * IconDefinition from `@design-atlas/ms-icons` or its string name (e.g. `"info"`, `"info-fill"`).
	 * Passing raw HTML/SVG strings is deprecated and kept temporarily for backwards compatibility.
	 */
	export let icon: IconDefinition | string | null = null;
	export let size: string = '1.5rem';
	export let label: string = '';
	export let className: string = '';

	let warnedRawHtml = false;

	$: isRawHtml = typeof icon === 'string' && icon.trim().startsWith('<');
	$: if (isRawHtml && !warnedRawHtml && typeof console !== 'undefined') {
		warnedRawHtml = true;
		console.warn(
			'[Design Atlas] Passing raw HTML/SVG strings to `icon` is deprecated. Pass an IconDefinition or icon name from `@design-atlas/ms-icons` instead.'
		);
	}

	$: resolvedDef =
		!icon || isRawHtml
			? null
			: typeof icon === 'string'
				? icons[icon] ?? null
				: icon;
</script>

{#if resolvedDef}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={resolvedDef.viewBox}
		width={size}
		height={size}
		fill="currentColor"
		class={`atl-icon ${resolvedDef.rtlMirror ? 'atl-icon--mirror' : ''} ${className}`.trim()}
		role={label ? 'img' : undefined}
		aria-label={label || undefined}
		aria-hidden={label ? undefined : 'true'}
		focusable={label ? undefined : 'false'}
	>
		{@html resolvedDef.body}
	</svg>
{:else if isRawHtml && typeof icon === 'string'}
	<span
		class={`atl-icon atl-icon--legacy ${className}`.trim()}
		style={`width: ${size}; height: ${size};`}
		aria-hidden={label ? undefined : 'true'}
		role={label ? 'img' : undefined}
		aria-label={label || undefined}
	>
		{@html icon}
	</span>
{/if}

<style>
	.atl-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		vertical-align: middle;
	}

	:global([dir='rtl']) .atl-icon--mirror {
		transform: scaleX(-1);
	}
</style>
