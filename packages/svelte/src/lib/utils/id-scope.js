import { getContext, setContext } from "svelte";

const ID_SCOPE_KEY = Symbol("atl-id-scope");

let globalCounter = 0;

/**
 * Establishes a scoped ID generator in Svelte context for child components.
 *
 * @param {string | undefined} baseId - Optional explicit base ID from the parent.
 * @param {string} prefix - Fallback prefix when `baseId` is not provided.
 * @returns {string}
 */
export function createIdScope(baseId, prefix) {
  const scopeId = baseId || `atl-${prefix}-${++globalCounter}`;
  let localCounter = 0;

  setContext(ID_SCOPE_KEY, {
    next(/** @type {string} */ itemPrefix) {
      localCounter += 1;
      return `${scopeId}-${itemPrefix}-${localCounter}`;
    },
  });

  return scopeId;
}

/**
 * Generates a unique ID using the nearest `createIdScope` context when present,
 * falling back to a monotonic module counter.
 *
 * @param {string} prefix
 * @returns {string}
 */
export function useId(prefix) {
  /** @type {{ next: (p: string) => string } | undefined} */
  const scope = getContext(ID_SCOPE_KEY);
  if (scope) {
    return scope.next(prefix);
  }
  globalCounter += 1;
  return `atl-${prefix}-${globalCounter}`;
}
