<script>
	import { keyboardArrowDown } from '@design-atlas/ms-icons';
	import AtlIcon from './AtlIcon.svelte';
	import AtlLabel from './AtlLabel.svelte';
	import { getAtlLocale } from './i18n/messages.js';

	const atlLocale = getAtlLocale();

	// Select props
	export let options = [];
	export let display_func = (a) => a;
	export let index = -1;
	export let value;
	export let disabled = false;
	export let placeholder = '';
	export let variant = 'default';
	export let icon = null;

	// Label props
	export let id = '';
	export let label = 'Label';
	export let optional = false;
	export let visuallyHidden = false;
	export let isLegend = false;
	export let required = false;
	export let description = '';

	let isOpen = false;
	let dropdownRef;
	const buttonId = `atl-select-${Math.random().toString(36).slice(2, 11)}`;
	let activeIndex = -1;

	$: resolvedPlaceholder = placeholder || atlLocale.messages.select.placeholder;
	$: resolvedId = id || buttonId;
	$: labelId = `${resolvedId}-label`;
	$: valueId = `${resolvedId}-value`;
	$: listboxId = `${resolvedId}-listbox`;
	$: activeOptionId =
		isOpen && activeIndex >= 0 && activeIndex < options.length
			? `${resolvedId}-option-${activeIndex}`
			: undefined;

	$: {
		value = index >= 0 ? options[index] : undefined;
	}

	function openDropdown() {
		if (disabled) return;
		isOpen = true;
		activeIndex = index >= 0 ? index : options.length > 0 ? 0 : -1;
	}

	function closeDropdown() {
		isOpen = false;
		activeIndex = -1;
	}

	function toggleDropdown() {
		if (disabled) return;
		if (isOpen) {
			closeDropdown();
		} else {
			openDropdown();
		}
	}

	function selectOption(i) {
		if (i < 0 || i >= options.length) return;
		index = i;
		closeDropdown();
	}

	function handleKeydown(event) {
		if (disabled) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (isOpen) {
					if (activeIndex >= 0) {
						selectOption(activeIndex);
					} else {
						closeDropdown();
					}
				} else {
					openDropdown();
				}
				break;
			case 'Escape':
				if (isOpen) {
					event.preventDefault();
					closeDropdown();
				}
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) {
					openDropdown();
				} else if (activeIndex < options.length - 1) {
					activeIndex = activeIndex + 1;
				}
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) {
					openDropdown();
				} else if (activeIndex > 0) {
					activeIndex = activeIndex - 1;
				}
				break;
			case 'Home':
				event.preventDefault();
				if (options.length > 0) {
					if (!isOpen) openDropdown();
					activeIndex = 0;
				}
				break;
			case 'End':
				event.preventDefault();
				if (options.length > 0) {
					if (!isOpen) openDropdown();
					activeIndex = options.length - 1;
				}
				break;
		}
	}

	function handleClickOutside(event) {
		if (dropdownRef && !dropdownRef.contains(event.target)) {
			closeDropdown();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="atl-select">
	{#if label}
		<div id={labelId}>
			<AtlLabel
				id={resolvedId}
				{label}
				{optional}
				{visuallyHidden}
				{isLegend}
				{required}
				{description}
				{disabled}
			/>
		</div>
	{/if}

	<div class="atl-select__control" bind:this={dropdownRef}>
		<button
			type="button"
			role="combobox"
			id={resolvedId}
			class="atl-select__trigger"
			class:atl-select__trigger--active={variant === 'active'}
			class:atl-select__trigger--open={isOpen}
			{disabled}
			on:click={toggleDropdown}
			on:keydown={handleKeydown}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-controls={isOpen ? listboxId : undefined}
			aria-activedescendant={activeOptionId}
			aria-labelledby={label ? `${labelId} ${valueId}` : valueId}
		>
			{#if icon}
				<span class="atl-select__icon">
					<AtlIcon {icon} size="16px" />
				</span>
			{/if}

			<span
				id={valueId}
				class="atl-select__text"
				class:atl-select__text--placeholder={index === -1}
			>
				{index >= 0 ? display_func(value) : resolvedPlaceholder}
			</span>

			<span class="atl-select__arrow" class:atl-select__arrow--open={isOpen}>
				<AtlIcon icon={keyboardArrowDown} size="24px" />
			</span>
		</button>

		{#if isOpen}
			<ul
				id={listboxId}
				class="atl-select__menu"
				role="listbox"
				aria-labelledby={label ? labelId : resolvedId}
			>
				{#each options as option, i}
					<li
						id={`${resolvedId}-option-${i}`}
						class="atl-select__item"
						class:atl-select__item--selected={i === index}
						class:atl-select__item--active={i === activeIndex}
						role="option"
						aria-selected={i === index}
						on:click={() => selectOption(i)}
						on:mouseenter={() => (activeIndex = i)}
						on:keydown={(e) => e.key === 'Enter' && selectOption(i)}
						tabindex="-1"
					>
						{display_func(option)}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.atl-select {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
		font-family: var(--font-family-sans-serif);

		& .atl-select__control {
			position: relative;
			display: inline-block;
		}

		& .atl-select__trigger {
			display: flex;
			align-items: center;
			gap: var(--spacing-8);
			width: var(--dimension-240);
			min-height: var(--size-40);
			padding: var(--spacing-8) var(--spacing-12);
			box-sizing: border-box;
			background-color: transparent;
			border: var(--border-width-1) solid var(--border-color-base);
			border-radius: var(--border-radius-4);
			font-family: var(--font-family-sans-serif);
			font-size: var(--font-size-16);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-label);
			color: var(--color-base);
			text-align: start;
			cursor: var(--cursor-pointer);
			transition: border-color 0.2s ease;

			&:hover:not(:disabled) {
				border-color: var(--border-color-accent);
			}

			&:focus-visible {
				outline: 2px solid var(--border-color-focus);
				outline-offset: 2px;
			}

			&.atl-select__trigger--open,
			&.atl-select__trigger--active {
				border-color: var(--border-color-accent);
			}

			&:disabled {
				cursor: var(--cursor-not-allowed);
				opacity: var(--opacity-50);
				background-color: var(--bgn-disable);
				border-color: var(--border-color-disable);
				color: var(--color-disable);
			}
		}

		& .atl-select__icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			color: inherit;
		}

		& .atl-select__text {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			&.atl-select__text--placeholder {
				color: var(--color-subtle);
			}
		}

		& .atl-select__arrow {
			margin-inline-start: auto;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			color: inherit;
			transition: transform 0.2s ease;

			&.atl-select__arrow--open {
				transform: rotate(180deg);
			}
		}

		& .atl-select__menu {
			position: absolute;
			inset-block-start: 100%;
			inset-inline: 0;
			z-index: 1000;
			margin-block-start: var(--spacing-4);
			margin-block-end: 0;
			margin-inline: 0;
			padding-block: var(--spacing-4);
			padding-inline: 0;
			list-style: none;
			background-color: var(--bgn-surface);
			border: var(--border-width-04) solid var(--border-color-subtle);
			border-radius: var(--border-radius-4);
			box-shadow: var(--shadow-md);
			max-height: var(--dimension-208);
			overflow-y: auto;
		}

		& .atl-select__item {
			padding: var(--spacing-8) var(--spacing-12);
			font-family: var(--font-family-sans-serif);
			font-size: var(--font-size-16);
			font-weight: var(--font-weight-regular);
			line-height: var(--line-height-label);
			color: var(--color-base);
			cursor: var(--cursor-pointer);
			transition: background-color 0.2s ease;

			&:hover,
			&:focus,
			&.atl-select__item--active {
				outline: none;
				background-color: var(--bgn-accent);
				color: var(--color-inverse);
			}

			&.atl-select__item--selected {
				background-color: var(--bgn-accent);
				color: var(--color-inverse);
			}
		}

		& .atl-select__menu:has(.atl-select__item:hover)
			.atl-select__item--selected:not(:hover) {
			background-color: transparent;
			color: var(--color-base);
		}
	}

	@media (max-width: 768px) {
		.atl-select {
			& .atl-select__trigger {
				width: 100%;
				min-height: var(--dimension-44);
			}

			& .atl-select__menu {
				max-height: 40vh;
			}
		}
	}
</style>
