/**
 * Svelte action that adds roving keyboard focus (Arrow keys, Home, End)
 * across a list of interactive elements.
 *
 * @typedef {Object} RovingFocusOptions
 * @property {string} selector - CSS selector for focusable items.
 * @property {"vertical" | "horizontal"} [orientation="vertical"] - Arrow key axis.
 * @property {() => HTMLElement[]} [getItems] - Custom item resolver (useful for nested widgets).
 * @property {boolean} [skipDisabled=true] - Whether to skip disabled elements.
 * @property {() => number} [getActiveIndex] - Custom active index resolver.
 * @property {(index: number, event: KeyboardEvent) => void} [onMove] - Callback fired before moving focus.
 * @property {boolean} [focusOnMove=true] - Whether to focus the target element automatically.
 */

/**
 * @param {HTMLElement} node
 * @param {RovingFocusOptions} options
 */
export function rovingFocus(node, options) {
  let opts = options;

  function resolveItems() {
    const raw = opts.getItems
      ? opts.getItems()
      : Array.from(node.querySelectorAll(opts.selector));

    if (opts.skipDisabled === false) {
      return raw;
    }

    return raw.filter((el) => {
      const htmlEl = /** @type {HTMLButtonElement} */ (el);
      return !htmlEl.disabled && el.getAttribute("aria-disabled") !== "true";
    });
  }

  /** @param {KeyboardEvent} event */
  function handleKeydown(event) {
    const orientation = opts.orientation ?? "vertical";
    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

    if (
      event.key !== nextKey &&
      event.key !== prevKey &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    const items = resolveItems();
    if (items.length === 0) return;

    const activeEl = /** @type {HTMLElement | null} */ (
      node.ownerDocument?.activeElement
    );
    const activeIndex = activeEl ? items.indexOf(activeEl) : -1;
    if (activeIndex === -1) return;

    let targetIndex = activeIndex;
    if (event.key === nextKey) {
      targetIndex = (activeIndex + 1) % items.length;
    } else if (event.key === prevKey) {
      targetIndex = (activeIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = items.length - 1;
    }

    opts.onMove?.(targetIndex, event);

    if (opts.focusOnMove !== false) {
      items[targetIndex]?.focus();
    }
  }

  node.addEventListener("keydown", handleKeydown);

  return {
    /** @param {RovingFocusOptions} nextOptions */
    update(nextOptions) {
      opts = nextOptions;
    },
    destroy() {
      node.removeEventListener("keydown", handleKeydown);
    },
  };
}
