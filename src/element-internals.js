import {
  refMap,
  validityMap,
  internalsMap,
  hiddenInputMap,
  validationMessageMap
} from './maps.js';
import { getHostRoot, initRef, initLabels, initForm, findParentForm } from './utils.js';
import { ValidityState, reconcileValidty, setInvalid, isValid, setValid } from './ValidityState.js';

export class ElementInternals {
  constructor(ref) {
    if (!ref || !ref.tagName || ref.tagName.indexOf('-') === -1) {
      throw new TypeError('Illegal constructor');
    }
    const validity = new ValidityState();
    refMap.set(this, ref);
    validityMap.set(this, validity);
    internalsMap.set(ref, this);
    const { labels, form } = this;
    Object.seal(this);

    initRef(ref, this);
    initLabels(ref, labels);
    initForm(ref, form, this);
  }

  checkValidity() {
    const validity = validityMap.get(this);
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
    return hostRoot.querySelectorAll(`[for=${id}]`);
  }

  reportValidity() {
    // TODO: Figure out how to polyfill this
  }

  setFormValue(value) {
    if (!this.form) {
      return undefined;
    }
    const hiddenInput = hiddenInputMap.get(this);
    hiddenInput.value = value;
  }

  setValidity(validityChanges, validationMessage) {
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
    this.reportValidity();
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
}
