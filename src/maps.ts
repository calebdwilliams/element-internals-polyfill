import { IElementInternals, ICustomElement } from './types';

export const refMap = new WeakMap<IElementInternals, ICustomElement>();
export const validityMap = new WeakMap<IElementInternals, ValidityState>();
export const hiddenInputMap = new WeakMap<IElementInternals, HTMLInputElement>();
export const internalsMap = new WeakMap<ICustomElement, IElementInternals>();
export const validationMessageMap = new WeakMap<IElementInternals, string>();
export const formsMap = new WeakMap<HTMLFormElement, Object>();
export const shadowHostsMap = new WeakMap<ICustomElement, MutationObserver>();
export const formElementsMap = new WeakMap<HTMLFormElement, Set<ICustomElement>>();
export const refValueMap = new WeakMap<ICustomElement, any>();

/** Elements that need to be upgraded once added to the DOM */
export const upgradeMap = new WeakMap<Element, IElementInternals>();
