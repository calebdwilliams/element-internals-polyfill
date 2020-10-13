import { hiddenInputMap, formsMap, formElementsMap, internalsMap } from './maps.js';
import { ICustomElement, IElementInternals, LabelsList } from './types.js';

const observerConfig = { attributes: true };

const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
  for (const mutation of mutationsList) {
    const attributeName = mutation.attributeName;
    const target = mutation.target as ICustomElement;

    if (attributeName === 'disabled' && target.constructor['formAssociated']) {
      if (target.formDisabledCallback) {
        target.formDisabledCallback.apply(target, [target.hasAttribute('disabled')]);
      }
    }
  }
});


/**
 * Recursively get the host root
 * @param {Node} - The node to find the host root for
 * @return {DocumentOrShadowRoot}
 */
export const getHostRoot = (node: Node) => {
  if (node instanceof Document) {
    return node;
  }
  let parent = node.parentNode;
  if (parent && parent.toString() !== '[object ShadowRoot]') {
    parent = getHostRoot(parent);
  }
  return parent;
};

/**
 * Initialize a ref by setting up an attribute observe on it
 * looking for changes to disabled
 * @param {HTMLElement} ref - The element to watch
 * @return {MutationObserver}
 */
export const initRef = (ref: ICustomElement) => {
  return observer.observe(ref, observerConfig);
};

/**
 * Set up labels for the ref
 * @param {ICustomElement} ref - The ref to add labels to
 * @param {LabelsList} labels - A list of the labels
 * @return {void}
 */
export const initLabels = (ref: ICustomElement, labels: LabelsList): void => {
  if (labels.length) {
    Array.from(labels).forEach(label =>
      label.addEventListener('click', ref.focus.bind(ref)));
    let firstLabelId = labels[0].id;
    if (!labels[0].id) {
      firstLabelId = `${labels[0].htmlFor}_Label`;
      labels[0].id = firstLabelId;
    }
    ref.setAttribute('aria-labelledby', firstLabelId);
  }
};

/**
 * The global form submit callback. We need to cancel any submission
 * if a nested internals is invalid.
 * @param {Event} - The form submit event
 * @return {void}
 */
export const formSubmitCallback = event => {
  /** Get the Set of elements attached to this form */
  const elements = formElementsMap.get(event.target);

  /** If the Set has items, continue */
  if (elements.size) {
    const nodes = Array.from(elements);
    /** Check the internals.checkValidity() of all nodes */
    const validityList = nodes
      .map(node => {
        const internals = internalsMap.get(node);
        return internals.checkValidity();
      });

    /** If any node is false, stop the event */
    if (validityList.includes(false)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  }
};

/**
 * The global form reset callback. This will loop over added
 * inputs and call formResetCallback if applicable
 * @return {void}
 */
export const formResetCallback = event => {
  /** Get the Set of elements attached to this form */
  const elements = formElementsMap.get(event.target);

  /** Loop over the elements and call formResetCallback if applicable */
  elements.forEach(element => {
    if ((element.constructor as any).formAssociated && element.formResetCallback) {
      element.formResetCallback.apply(element);
    }
  });
};

/**
 * Initialize the form. We will need to add submit and reset listeners
 * if they don't already exist. If they do, just add the new ref to the form.
 * @param {HTMLElement} ref - The element ref that includes internals
 * @param {HTMLFormElement} form - The form the ref belongs to
 * @param {ElementInternals} internals - The internals for ref
 * @return {void}
 */
export const initForm = (ref: ICustomElement, form: HTMLFormElement, internals: IElementInternals) => {
  if (form) {
    /** This will be a WeakMap<HTMLFormElement, Set<HTMLElement> */
    const formElements = formElementsMap.get(form);

    if (formElements) {
      /** If formElements exists, add to it */
      formElements.add(ref);
    } else {
      /** If formElements doesn't exist, create it and add to it */
      const initSet = new Set<ICustomElement>();
      initSet.add(ref);
      formElementsMap.set(form, initSet);

      /** Add listeners to emulate validation and reset behavior */
      form.addEventListener('submit', formSubmitCallback);
      form.addEventListener('reset', formResetCallback);
    }

    /** Save the element on the form instance if it has a name */
    if (ref.hasAttribute('name')) {
      form[ref.getAttribute('name')] = ref;
    }
    formsMap.set(form, { ref, internals });

    /** Call formAssociatedCallback if applicable */
    if (ref.constructor['formAssociated'] && ref.formAssociatedCallback) {
      ref.formAssociatedCallback.apply(ref, [form]);
    }
  }
};

/**
 * Recursively look for an element's parent form
 * @param {Element} elem - The element to look for a parent form
 * @return {HTMLFormElement|null} - The parent form, if one exists
 */
export const findParentForm = elem => {
  let parent = elem.parentNode;
  if (parent && parent.tagName !== 'FORM') {
    parent = findParentForm(parent);
  } else if (!parent && elem.toString() === '[object ShadowRoot]') {
    parent = findParentForm(elem.host);
  }
  return parent;
};
