import {
  refMap,
  validityMap,
  internalsMap,
  validationMessageMap,
  shadowHostsMap,
  formElementsMap,
  refValueMap
} from './maps.js';
import { aom, initAom } from './aom.js';
import { getHostRoot, initRef, initLabels, initForm, findParentForm } from './utils.js';
import { ValidityState, reconcileValidty, setValid } from './ValidityState.js';
import { observerCallback, observerConfig } from './mutation-observers.js';

class ElementInternals {
  constructor(ref) {
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

    initRef(ref);
    initLabels(ref, labels);
    initForm(ref, form, this);
  }

  checkValidity() {
    const validity = validityMap.get(this);
    const ref = refMap.get(this);
    const validityEvent = new Event(validity.valid, {
      bubbles: false,
      cancelable: true,
      composed: false
    });
    ref.dispatchEvent(validityEvent)
    return validity.valid;
  }

  get form() {
    const ref = refMap.get(this);
    let form;
    if (ref && ref.constructor.formAssociated === true) {
      form = findParentForm(ref);
    }
    return form;
  }

  get labels() {
    const ref = refMap.get(this);
    const id = ref.getAttribute('id');
    const hostRoot = getHostRoot(ref);
    return hostRoot ? hostRoot.querySelectorAll(`[for=${id}]`) : [];
  }

  reportValidity() {
    return this.checkValidity();
  }

  setFormValue(value) {
    if (!this.form) {
      return undefined;
    }
    const ref = refMap.get(this);
    refValueMap.set(ref, value);
  }

  setValidity(validityChanges, validationMessage) {
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
    ref.setAttribute('aria-invalid', !valid);
  }

  get validationMessage() {
    return validationMessageMap.get(this);
  }

  get validity() {
    const validity = validityMap.get(this);
    return validity;
  }

  get willValidate() {
    const ref = refMap.get(this);
    if (ref.disabled || ref.hasAttribute('disabled')) {
      return false;
    }
    return true;
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

  Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
    get() {
      return () => {
        if (this.tagName.indexOf('-') === -1) {
          throw new Error(`Failed to execute 'attachInternals' on 'HTMLElement': Unable to attach ElementInternals to non-custom elements.`);
        }
        return new ElementInternals(this);
      };
    }
  });

  const attachShadow = HTMLElement.prototype.attachShadow;
  HTMLElement.prototype.attachShadow = attachShadowObserver;

  const documentObserver = new MutationObserver(observerCallback);
  documentObserver.observe(document.body, observerConfig);

  const formDataOriginal = window.FormData;

  class FormData {
    constructor(form) {
      const data = new formDataOriginal(form);
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

  window.FormData = FormData;
}
