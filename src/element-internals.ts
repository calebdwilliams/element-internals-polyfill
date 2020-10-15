import {
  refMap,
  validityMap,
  internalsMap,
  validationMessageMap,
  shadowHostsMap,
  formElementsMap,
  refValueMap,
  hiddenInputMap
} from './maps';
import { initAom } from './aom';
import { getHostRoot, initRef, initLabels, initForm, findParentForm } from './utils';
import { ValidityState, reconcileValidty, setValid } from './ValidityState';
import { observerCallback, observerConfig } from './mutation-observers';
import { IElementInternals, ICustomElement, LabelsList } from './types';

export class ElementInternals implements IElementInternals {
  ariaAtomic: string;
  ariaAutoComplete: string;
  ariaBusy: string;
  ariaChecked: string;
  ariaColCount: string;
  ariaColIndex: string;
  ariaColSpan: string;
  ariaCurrent: string;
  ariaDisabled: string;
  ariaExpanded: string;
  ariaHasPopup: string;
  ariaHidden: string;
  ariaKeyShortcuts: string;
  ariaLabel: string;
  ariaLevel: string;
  ariaLive: string;
  ariaModal: string;
  ariaMultiLine: string;
  ariaMultiSelectable: string;
  ariaOrientation: string;
  ariaPlaceholder: string;
  ariaPosInSet: string;
  ariaPressed: string;
  ariaReadOnly: string;
  ariaRelevant: string;
  ariaRequired: string;
  ariaRoleDescription: string;
  ariaRowCount: string;
  ariaRowIndex: string;
  ariaRowSpan: string;
  ariaSelected: string;
  ariaSort: string;
  ariaValueMax: string;
  ariaValueMin: string;
  ariaValueNow: string;
  ariaValueText: string;

  static get isPolyfilled() {
    return true;
  }

  constructor(ref: ICustomElement) {
    if (!ref || !ref.tagName || ref.tagName.indexOf('-') === -1) {
      throw new TypeError('Illegal constructor');
    }
    const validity = new ValidityState();
    refMap.set(this, ref);
    validityMap.set(this, validity);
    internalsMap.set(ref, this);
    const { labels, form } = this;
    initAom(ref, this);
    Object.seal(this);

    initRef(ref, this);
    initLabels(ref, labels);
    initForm(ref, form, this);
  }

  /**
   * Will return true if the element is in a valid state
   */
  checkValidity(): boolean {
    const validity = validityMap.get(this);
    const ref = refMap.get(this);
    if (!validity.valid) {
      const validityEvent = new Event('invalid', {
        bubbles: false,
        cancelable: true,
        composed: false
      });
      ref.dispatchEvent(validityEvent);
    }
    return validity.valid;
  }

  /** The form element the custom element is associated with */
  get form(): HTMLFormElement {
    const ref = refMap.get(this);
    let form;
    if (ref.constructor['formAssociated'] === true) {
      form = findParentForm(ref);
    }
    return form;
  }

  /** A list of all relative form labels for this element */
  get labels(): LabelsList {
    const ref = refMap.get(this);
    const id = ref.getAttribute('id');
    const hostRoot = getHostRoot(ref);
    if (hostRoot && id) {
      return hostRoot ? hostRoot.querySelectorAll(`[for=${id}]`) : [];
    }
    return [];
  }

  /** Will report the elements validity state */
  reportValidity(): boolean {
    return this.checkValidity();
  }

  /** Sets the element's value within the form */
  setFormValue(value: string): void {
    const hiddenInput = hiddenInputMap.get(this);
    if (hiddenInput) {
      hiddenInput.value = value;
    }
    if (!this.form) {
      return undefined;
    }
    const ref = refMap.get(this);
    refValueMap.set(ref, value);
  }

  /**
   * Sets the element's validity. The first argument is a partial ValidityState object
   * reflecting the changes to be made to the element's validity. If the element is invalid,
   * the second argument sets the element's validition message.
   *
   * If the field is valid and a message is specified, the method will throw a TypeError.
   */
  setValidity(validityChanges: Partial<globalThis.ValidityState>, validationMessage?: string) {
    const ref = refMap.get(this);
    if (!validityChanges) {
      throw new TypeError('Failed to execute \'setValidity\' on \'ElementInternals\': 1 argument required, but only 0 present.');
    }
    const validity = validityMap.get(this);
    if (Object.keys(validityChanges).length === 0) {
      setValid(validity);
    }
    const check = { ...validity, ...validityChanges };
    delete check.valid;
    const { valid } = reconcileValidty(validity, check);

    if (!valid && !validationMessage) {
      throw new DOMException(`Failed to execute 'setValidity' on 'ElementInternals': The second argument should not be empty if one or more flags in the first argument are true.`);
    }
    validationMessageMap.set(this, valid ? '' : validationMessage);
    ref.setAttribute('aria-invalid', `${!valid}`);
  }

  /** The element's validation message set during a call to ElementInternals.setValidity */
  get validationMessage(): string {
    return validationMessageMap.get(this);
  }

  /** The current validity state of the object */
  get validity(): globalThis.ValidityState {
    const validity = validityMap.get(this);
    return validity;
  }

  /** If true the element will participate in a form's constraint validation. */
  get willValidate(): boolean {
    const ref = refMap.get(this);

    if (ref.disabled || ref.hasAttribute('disabled')) {
      return false;
    }
    return true;
  }
}

declare global {
  interface Window {
    ElementInternals: typeof ElementInternals
  }
}

if (!window.ElementInternals) {
  window.ElementInternals = ElementInternals;

  function attachShadowObserver(...args) {
    const shadowRoot = attachShadow.apply(this, args);
    const observer = new MutationObserver(observerCallback);
    observer.observe(shadowRoot, observerConfig);
    shadowHostsMap.set(this, observer);
    return shadowRoot;
  }

  /**
   * Attaches an ElementInternals instance to a custom element. Calling this method
   * on a built-in element will throw an error.
   */
  Object.defineProperty(Element.prototype, 'attachInternals', {
    get() {
      return () => {
        if (this.tagName.indexOf('-') === -1) {
          throw new Error(`Failed to execute 'attachInternals' on 'HTMLElement': Unable to attach ElementInternals to non-custom elements.`);
        }
        return new ElementInternals(this);
      };
    }
  });

  const attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = attachShadowObserver;

  const documentObserver = new MutationObserver(observerCallback);
  documentObserver.observe(document.documentElement, observerConfig);

  const FormDataOriginal = window.FormData;

  class FormData {
    constructor(form?: HTMLFormElement) {
      const data = new FormDataOriginal(form);
      if (form && formElementsMap.has(form)) {
        const refs = formElementsMap.get(form);
        refs.forEach(ref => {
          if (ref.getAttribute('name')) {
            const value = refValueMap.get(ref);
            data.set(ref.getAttribute('name'), value);
          }
        });
      }
      return data;
    }
  }

  // @ts-ignore
  window.FormData = FormData;
}
