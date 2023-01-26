/**
 * This file contains the WeakMaps used throughout this project. The WeakMaps exist to tie
 * objects together without polluting the objects themselves with references we'd rather keep
 * hidden. This allows the polyfill to work as transparently as possible.
 */
import { IElementInternals, ICustomElement } from './types';

/** Use an ElementInternals instance to get a reference to the element it is attached to */
export const refMap = new WeakMap<IElementInternals, ICustomElement>();

/** Usee an ElementsInternals instance to get its ValidityState object */
export const validityMap = new WeakMap<IElementInternals, ValidityState>();

/** Use an ElementInternals instance to get its attached input[type="hidden"] */
export const hiddenInputMap = new WeakMap<IElementInternals, HTMLInputElement[]>();

/** Use a custom element to get its attached ElementInternals instance */
export const internalsMap = new WeakMap<ICustomElement, IElementInternals>();

/** Use an ElementInternals instance to get the attached validation message */
export const validationMessageMap = new WeakMap<IElementInternals, string>();

/** Use a form element to get attached custom elements and ElementInternals instances */
export const formsMap = new WeakMap<HTMLFormElement, Object>();

/** Use a custom element or other object to get their associated MutationObservers */
export const shadowHostsMap = new WeakMap<ICustomElement, MutationObserver>();

/** Use a form element to get a set of attached custom elements */
export const formElementsMap = new WeakMap<HTMLFormElement, Set<ICustomElement>>();

/** Use an ElementInternals instance to get a reference to an element's value */
export const refValueMap = new WeakMap<ICustomElement, any>();

/** Elements that need to be upgraded once added to the DOM */
export const upgradeMap = new WeakMap<Element, IElementInternals>();

/** Save references to shadow roots for inclusion in internals instance */
export const shadowRootMap = new WeakMap<ICustomElement, ShadowRoot>();

/** Save a reference to the internals' validation anchor */
export const validationAnchorMap = new WeakMap<IElementInternals, HTMLElement>();

/** Map DocumentFragments to their MutationObservers so we can disconnect once elements are removed */
export const documentFragmentMap = new WeakMap<DocumentFragment, MutationObserver>();

/** Whether connectedCallback has already been called. */
export const connectedCallbackMap = new WeakMap<ICustomElement, boolean>();

/** Save a reference to validity state for elements that need to upgrade after being connected */
export const validityUpgradeMap = new WeakMap<ICustomElement, IElementInternals>();
