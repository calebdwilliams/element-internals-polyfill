import { hiddenInputMap, formsMap, formElementsMap, internalsMap, onSubmitMap } from './maps.js';
import { ICustomElement, IElementInternals, LabelsList } from './types.js';

const observerConfig: MutationObserverInit = { attributes: true, attributeFilter: ['disabled'] };

const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
  for (const mutation of mutationsList) {
    const target = mutation.target as ICustomElement;

    if (target.constructor['formAssociated']) {
      const isDisabled = target.hasAttribute('disabled');
      target.toggleAttribute('internals-disabled', isDisabled);
      if (target.formDisabledCallback) {
        target.formDisabledCallback.apply(target, [target.hasAttribute('disabled')]);
      }
    }
  }
});

/**
 * Removes all hidden inputs for the given element internals instance
 * @param {IElementInternals} internals - The element internals instance
 * @return {void}
 */
export const removeHiddenInputs = (internals: IElementInternals): void => {
  const hiddenInputs = hiddenInputMap.get(internals);
  hiddenInputs.forEach(hiddenInput => {
    hiddenInput.remove();
  });
  hiddenInputMap.set(internals, []);
}

/**
 * Creates a hidden input for the given ref
 * @param {ICustomElement} ref - The element to watch
 * @param {IElementInternals} internals - The element internals instance for the ref
 * @return {HTMLInputElement} The hidden input
 */
export const createHiddenInput = (ref: ICustomElement, internals: IElementInternals): HTMLInputElement | null => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = ref.getAttribute('name');
  ref.after(input);
  hiddenInputMap.get(internals).push(input);
  return input;
}

/**
 * Initialize a ref by setting up an attribute observe on it
 * looking for changes to disabled
 * @param {ICustomElement} ref - The element to watch
 * @param {IElementInternals} internals - The element internals instance for the ref
 * @return {void}
 */
export const initRef = (ref: ICustomElement, internals: IElementInternals): void => {
  hiddenInputMap.set(internals, []);

  const isDisabled = ref.hasAttribute('disabled');
  ref.toggleAttribute('internals-disabled', isDisabled);

  observer.observe(ref, observerConfig);
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
 * Sets the internals-valid and internals-invalid attributes
 * based on form validity.
 * @param {HTMLFormElement} - The target form
 * @return {void}
 */
export const setFormValidity = (form: HTMLFormElement) => {
  const nativeControlValidity = Array.from(form.elements)
    .map(
      (element: Element & { validity: ValidityState }) => element.validity.valid
    );
  const polyfilledVaidity = Array.from(formElementsMap.get(form))
    .filter(control => control.isConnected)
    .map((control: ICustomElement) =>
      internalsMap.get(control).validity.valid
    );
  const hasInvalid = [...nativeControlValidity, ...polyfilledVaidity].includes(false);
  form.toggleAttribute('internals-invalid', hasInvalid);
  form.toggleAttribute('internals-valid', !hasInvalid);
}

/**
 * The global form input callback. Updates the form's validity
 * attributes on input.
 * @param {Event} - The form input event
 * @return {void}
 */
export const formInputCallback = (event: Event) => {
  setFormValidity(findParentForm(event.target));
};

/**
 * The global form change callback. Updates the form's validity
 * attributes on change.
 * @param {Event} - The form change event
 * @return {void}
 */
 export const formChangeCallback = (event: Event) => {
  setFormValidity(findParentForm(event.target));
};

/**
 * The global form submit callback. We need to cancel any submission
 * if a nested internals is invalid.
 * @param {Event} - The form submit event
 * @return {void}
 */
export const formSubmitCallback = (event: Event) => {
  /** Get the Set of elements attached to this form */
  const form = event.target as HTMLFormElement;
  const elements = formElementsMap.get(form);

  /**
   * If this form does not validate then we're done
   */
  if (form.noValidate) {
    return;
  }

  /** If the Set has items, continue */
  if (elements.size) {
    const nodes = Array.from(elements);
    /** Check the internals.checkValidity() of all nodes */
    const validityList = nodes
      .reverse()
      .map(node => {
        const internals = internalsMap.get(node);
        return internals.reportValidity();
      });

    /** If any node is false, stop the event */
    if (validityList.includes(false)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    } else if (onSubmitMap.get(form)) {
      const callback = onSubmitMap.get(form);
      const canceled = callback.call(form, event);
      if (canceled === false) {
        event.preventDefault();
      }
    }
  }
};

/**
 * The global form reset callback. This will loop over added
 * inputs and call formResetCallback if applicable
 * @return {void}
 */
export const formResetCallback = (event: Event) => {
  /** Get the Set of elements attached to this form */
  const elements = formElementsMap.get(event.target as HTMLFormElement);

  /** Some forms won't contain form associated custom elements */
  if (elements && elements.size) {
    /** Loop over the elements and call formResetCallback if applicable */
    elements.forEach(element => {
      if ((element.constructor as any).formAssociated && element.formResetCallback) {
        element.formResetCallback.apply(element);
      }
    });
  }
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
    /** If the form has an onsubmit function, save it and remove it */
    if (form.onsubmit) {
      /** TODO: Find a way to parse arguments better */
      onSubmitMap.set(form, form.onsubmit.bind(form));
      form.onsubmit = null;
    }

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
      form.addEventListener('input', formInputCallback);
      form.addEventListener('change', formChangeCallback);
    }

    formsMap.set(form, { ref, internals });

    /** Call formAssociatedCallback if applicable */
    if (ref.constructor['formAssociated'] && ref.formAssociatedCallback) {
      setTimeout(() => {
        ref.formAssociatedCallback.apply(ref, [form]);
      }, 0);
    }
    setFormValidity(form);
  }
};

/**
 * Recursively look for an element's parent form
 * @param {Element} elem - The element to look for a parent form
 * @return {HTMLFormElement|null} - The parent form, if one exists
 */
export const findParentForm = (elem) => {
  let parent = elem.parentNode;
  if (parent && parent.tagName !== 'FORM') {
    parent = findParentForm(parent);
  }
  return parent;
};

/**
 * Throw an error if the element ref is not form associated
 * @param ref {ICustomElement} - The element to check if it is form associated
 * @param message {string} - The error message to throw
 * @param ErrorType {any} - The error type to throw, defaults to DOMException
 */
export const throwIfNotFormAssociated = (ref: ICustomElement, message: string, ErrorType: any = DOMException): void => {
  if (!ref.constructor['formAssociated']) {
    throw new ErrorType(message);
  }
}

/**
 * Called for each HTMLFormElement.checkValidity|reportValidity
 * will loop over a form's added components and call the respective
 * method modifying the default return value if needed
 * @param form {HTMLFormElement} - The form element to run the method on
 * @param returnValue {boolean} - The initial result of the original method
 * @param method {'checkValidity'|'reportValidity'} - The original method
 * @returns {boolean} The form's validity state
 */
export const overrideFormMethod = (form: HTMLFormElement, returnValue: boolean, method: 'checkValidity'|'reportValidity'): boolean => {
  const elements = formElementsMap.get(form);

  /** Some forms won't contain form associated custom elements */
  if (elements && elements.size) {
    elements.forEach(element => {
      const internals = internalsMap.get(element);
      const valid = internals[method]();
      if (!valid) {
        returnValue = false;
      }
    });
  }
  return returnValue;
};

/**
 * Will upgrade an ElementInternals instance by initializing the
 * instance's form and labels. This is called when the element is
 * either constructed or appended from a DocumentFragment
 * @param ref {ICustomElement} - The custom element to upgrade
 */
export const upgradeInternals = (ref: ICustomElement) => {
  if (ref.constructor['formAssociated']) {
    const internals = internalsMap.get(ref);
    const { labels, form } = internals;
    initLabels(ref, labels);
    initForm(ref, form, internals);
  }
};
