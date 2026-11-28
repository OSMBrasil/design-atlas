<script lang="ts">
  import { openInNew, type IconDefinition } from '@design-atlas/ms-icons';
  import AtlIcon from './AtlIcon.svelte';

  export let href: string | undefined = undefined;
  export let external: boolean = false;
  export let asChild: boolean = false;
  export let className: string = '';

  export let variant: 'underline' | 'basic' = 'underline';
  export let size: 'md' | 'sm' = 'md';
  export let icon: IconDefinition | string | null = null;
  export let leftIcon: boolean = false;
  export let externalLabel: string = '(opens in a new tab)';

  $: rel = external ? 'noopener noreferrer' : undefined;
  $: target = external ? '_blank' : undefined;
  $: resolvedIcon = icon ?? (external ? openInNew : null);

  const baseClass = 'atl-link';
  $: variantClass = variant === 'underline' ? 'atl-link--underline' : 'atl-link--basic';
  $: sizeClass = size === 'sm' ? 'atl-link--sm' : 'atl-link--md';
  $: classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
</script>

{#if asChild}
  <slot class={classes} />
{:else}
  <a
    {href}
    {rel}
    {target}
    class={classes}
  >
    {#if resolvedIcon && leftIcon}
      <span class="atl-link__icon" aria-hidden="true"><AtlIcon icon={resolvedIcon} size="1em" /></span>
    {/if}

    <slot />

    {#if external && externalLabel}
      <span class="atl-link__sr-only"> {externalLabel}</span>
    {/if}

    {#if resolvedIcon && !leftIcon}
      <span class="atl-link__icon" aria-hidden="true"><AtlIcon icon={resolvedIcon} size="1em" /></span>
    {/if}
  </a>
{/if}

<style>
  .atl-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-4);
    font-weight: var(--font-weight-regular);
    cursor: var(--cursor-pointer);
    transition: color 0.2s;
    vertical-align: bottom;

    &:focus-visible {
      outline: 2px solid var(--border-color-focus);
      outline-offset: 2px;
      border-radius: var(--border-radius-4);
    }

    /* Sizes */
    &.atl-link--md {
      font-size: var(--font-size-16);
      line-height: var(--line-height-paragraph);
    }

    &.atl-link--sm {
      font-size: var(--font-size-12);
      line-height: var(--line-height-label);
    }

    /* Variants */
    &.atl-link--underline {
      text-decoration: var(--text-decoration-underline);
      color: var(--color-base);

      &:visited {
        text-decoration: var(--text-decoration-underline);
        color: var(--color-link-visited);
      }

      &:hover {
        color: var(--color-link);
      }

      &:active {
        color: var(--color-link-active);
      }
    }

    &.atl-link--basic {
      text-decoration: var(--text-decoration-none);
      color: var(--color-link);

      &:visited {
        color: var(--color-link-visited);
      }

      &:hover {
        text-decoration: var(--text-decoration-underline);
        color: var(--color-link);
      }

      &:active {
        text-decoration: var(--text-decoration-underline);
        color: var(--color-link-active);
      }
    }
  }

  .atl-link__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: center;
  }

  .atl-link__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
