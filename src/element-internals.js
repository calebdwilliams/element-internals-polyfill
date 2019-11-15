import {
  refMap,
  validityMap,
  internalsMap,
  hiddenInputMap,
  validationMessageMap
} from './maps.js';
import { getHostRoot, initRef, initLabels, initForm, findParentForm } from './utils.js';
import { ValidityState, isValid } from './ValidityState.js';

export class ElementInternals {
  constructor(ref) {
    const validity = new ValidityState();
    refMap.set(this, ref);
    validityMap.set(this, validity);
    internalsMap.set(ref, this);
    const { labels, form } = this;
    Object.seal(this);

    // Promise.resolve().then(() => {
      initRef(ref, this);
      initLabels(ref, labels);
      initForm(ref, form, this);
    // });
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
      return;
    }
    const hiddenInput = hiddenInputMap.get(this);
    hiddenInput.value = value;
  }

  setValidity(validityChanges = {}, validationMessage = '') {
    const validity = validityMap.get(this);
    if (Object.keys(validityChanges).length === 0) {
      console.log('yes')
      validity.valid = true;
      for (const key in validity) {
        if (key !== 'valid') {
          validity[key] = false;
        }
      }
    } else {
      for (const key in validityChanges) {
        if (validityChanges.hasOwnProperty(key)) {
          const value = validityChanges[key];
          validity[key] = validityChanges[key];

          if (value === true && key !== 'valid') {
            validity.valid = false;
          }
        }
      }
    }

    validationMessageMap.set(this, validationMessage);
    // if (validationMessage && validationMessage !== '') {
    //   validity.customError = true;
    //   validity.valid = false;
    // } else if (validationMessage === '') {
    //   validity.customError = false;
    //   validity.valid = true;
    // }

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
        return new ElementInternals(this);
      };
    }
  });
}
