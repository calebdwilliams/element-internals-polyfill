/** @type {WeakMap<ElementInternals, HTMLElement>} */
export const refMap = new WeakMap();

/** @type {WeakMap<ElementInternals, ValidityState>} */
export const validityMap = new WeakMap();

/** @type {WeakMap<ElementInternals, HTMLInputElement>} */
export const hiddenInputMap = new WeakMap();

/** @type {WeakMap<HTMLElement, ElementInternals>} */
export const internalsMap = new WeakMap();

/** @type {WeakMap<ElementInternals, String>} */
export const validationMessageMap = new WeakMap();

/** @type {Weakmap<HTMLFormElement, Object>} */
export const formsMap = new WeakMap();

/** @type {WeakMap<HTMLElement, MutationObserver>} */
export const shadowHostsMap = new WeakMap();

/** @type {WeakMap<HTMLFormElement, Set<HTMLElement>>} */
export const formElementsMap = new WeakMap();

/**
 * Save the value from a ref from call to setFormValue
 * @type {WeakMap<HTMLElement, any>}
 */
export const refValueMap = new WeakMap();
