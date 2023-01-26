import {
  connectedCallbackMap,
  formElementsMap,
  internalsMap,
  refMap,
  refValueMap,
  shadowHostsMap,
  shadowRootMap,
  validationAnchorMap,
  validityMap,
  validationMessageMap,
  validityUpgradeMap,
} from './maps';
import {
  createHiddenInput,
  findParentForm,
  initRef,
  overrideFormMethod,
  removeHiddenInputs,
  setDisabled,
  throwIfNotFormAssociated,
  upgradeInternals
} from './utils';
import { initAom } from './aom';
import { ValidityState, reconcileValidity, setValid } from './ValidityState';
import { deferUpgrade, observerCallback, observerConfig } from './mutation-observers';
import { IElementInternals, ICustomElement, LabelsList } from './types';
import { CustomStateSet } from './CustomStateSet';
import { HTMLFormControlsCollection } from './HTMLFormControlsCollection';

export class ElementInternals implements IElementInternals {
  ariaAtomic: string;
  ariaAutoComplete: string;
  ariaBusy: string;
  ariaChecked: string;
  ariaColCount: string;
  ariaColIndex: string;
  ariaColIndexText: string;
  ariaColSpan: string;
  ariaCurrent: string;
  ariaDisabled: string;
  ariaExpanded: string;
  ariaHasPopup: string;
  ariaHidden: string;
  ariaInvalid: string;
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
  ariaRowIndexText: string;
  ariaRowSpan: string;
  ariaSelected: string;
  ariaSetSize: string;
  ariaSort: string;
  ariaValueMax: string;
  ariaValueMin: string;
  ariaValueNow: string;
  ariaValueText: string;
  role: string;

  states: CustomStateSet;

  static get isPolyfilled() {
    return true;
  }

  constructor(ref: ICustomElement) {
    if (!ref || !ref.tagName || ref.tagName.indexOf('-') === -1) {
      throw new TypeError('Illegal constructor');
    }
    const rootNode = ref.getRootNode();
    const validity = new ValidityState();
    this.states = new CustomStateSet(ref);
    refMap.set(this, ref);
    validityMap.set(this, validity);
    internalsMap.set(ref, this);
    initAom(ref, this);
    initRef(ref, this);
    Object.seal(this);

    upgradeInternals(ref);

    /**
     * If appended from a DocumentFragment, wait until it is connected
     * before attempting to upgrade the internals instance
     */
    if (rootNode instanceof DocumentFragment) {
      deferUpgrade(rootNode);
    }
  }

  /**
   * Will return true if the element is in a valid state
   */
  checkValidity(): boolean {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to execute 'checkValidity' on 'ElementInternals': The target element is not a form-associated custom element.`);
    /** If the element will not validate, it is necessarily valid by default */
    if (!this.willValidate) {
      return true;
    }
    const validity = validityMap.get(this);
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
    throwIfNotFormAssociated(ref, `Failed to read the 'form' property from 'ElementInternals': The target element is not a form-associated custom element.`);
    let form;
    if (ref.constructor['formAssociated'] === true) {
      form = findParentForm(ref);
    }
    return form;
  }

  /** A list of all relative form labels for this element */
  get labels(): LabelsList {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to read the 'labels' property from 'ElementInternals': The target element is not a form-associated custom element.`);
    const id = ref.getAttribute('id');
    const hostRoot = ref.getRootNode() as Element;
    if (hostRoot && id) {
      return hostRoot.querySelectorAll<HTMLLabelElement>(`[for="${id}"]`) as unknown as LabelsList;
    }
    return [] as unknown as LabelsList;
  }

  /** Will report the elements validity state */
  reportValidity(): boolean {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to execute 'reportValidity' on 'ElementInternals': The target element is not a form-associated custom element.`);
    /** If the element will not validate, it is valid by default */
    if (!this.willValidate) {
      return true;
    }
    const valid =  this.checkValidity();
    const anchor = validationAnchorMap.get(this);
    if (anchor && !ref.constructor['formAssociated']) {
      throw new DOMException(`Failed to execute 'reportValidity' on 'ElementInternals': The target element is not a form-associated custom element.`);
    }
    if (!valid && anchor) {
      ref.focus();
      anchor.focus();
    }
    return valid;
  }

  /** Sets the element's value within the form */
  setFormValue(value: string | FormData | null): void {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to execute 'setFormValue' on 'ElementInternals': The target element is not a form-associated custom element.`);
    removeHiddenInputs(this);
    if (value != null && !(value instanceof FormData)) {
      if (ref.getAttribute('name')) {
        const hiddenInput = createHiddenInput(ref, this);
        hiddenInput.value = value;
      }
    } else if (value != null && value instanceof FormData) {
      Array.from(value).reverse().forEach(([formDataKey, formDataValue]) => {
        if (typeof formDataValue === 'string') {
          const hiddenInput = createHiddenInput(ref, this);
          hiddenInput.name = formDataKey;
          hiddenInput.value = formDataValue;
        }
      });
    }
    refValueMap.set(ref, value);
  }

  /**
   * Sets the element's validity. The first argument is a partial ValidityState object
   * reflecting the changes to be made to the element's validity. If the element is invalid,
   * the second argument sets the element's validation message.
   *
   * If the field is valid and a message is specified, the method will throw a TypeError.
   */
  setValidity(validityChanges: Partial<globalThis.ValidityState>, validationMessage?: string, anchor?: HTMLElement) {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to execute 'setValidity' on 'ElementInternals': The target element is not a form-associated custom element.`);
    if (!validityChanges) {
      throw new TypeError('Failed to execute \'setValidity\' on \'ElementInternals\': 1 argument required, but only 0 present.');
    }
    validationAnchorMap.set(this, anchor);
    const validity = validityMap.get(this);
    const validityChangesObj: Partial<ValidityState> = {};
    for (const key in validityChanges) {
      validityChangesObj[key] = validityChanges[key];
    }
    if (Object.keys(validityChangesObj).length === 0) {
      setValid(validity);
    }
    const check = { ...validity, ...validityChangesObj };
    delete check.valid;
    const { valid } = reconcileValidity(validity, check, this.form);

    if (!valid && !validationMessage) {
      throw new DOMException(`Failed to execute 'setValidity' on 'ElementInternals': The second argument should not be empty if one or more flags in the first argument are true.`);
    }
    validationMessageMap.set(this, valid ? '' : validationMessage);

    // check to make sure the host element is connected before adding attributes
    // because safari doesnt allow elements to have attributes added in the constructor
    if (ref.isConnected) {
      ref.toggleAttribute('internals-invalid', !valid);
      ref.toggleAttribute('internals-valid', valid);
      ref.setAttribute('aria-invalid', `${!valid}`);
    } else {
      validityUpgradeMap.set(ref, this);
    }
  }

  get shadowRoot(): ShadowRoot | null {
    const ref = refMap.get(this);
    const shadowRoot = shadowRootMap.get(ref);
    if (shadowRoot) {
      return shadowRoot;
    }
    return null;
  }

  /** The element's validation message set during a call to ElementInternals.setValidity */
  get validationMessage(): string {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to read the 'validationMessage' property from 'ElementInternals': The target element is not a form-associated custom element.`);
    return validationMessageMap.get(this);
  }

  /** The current validity state of the object */
  get validity(): globalThis.ValidityState {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to read the 'validity' property from 'ElementInternals': The target element is not a form-associated custom element.`);
    const validity = validityMap.get(this);
    return validity;
  }

  /** If true the element will participate in a form's constraint validation. */
  get willValidate(): boolean {
    const ref = refMap.get(this);
    throwIfNotFormAssociated(ref, `Failed to read the 'willValidate' property from 'ElementInternals': The target element is not a form-associated custom element.`);
    if (
      (ref.disabled || ref.hasAttribute('disabled')) ||
      ref.hasAttribute('readonly')
    ) {
      return false;
    }
    return true;
  }
}

declare global {
  interface CustomElementConstructor {
    formAssociated?: boolean;
  }

  interface Window {
    ElementInternals: typeof ElementInternals
  }
}

export function isElementInternalsSupported(): boolean {
  if (!window.ElementInternals || !HTMLElement.prototype.attachInternals) {
    return false;
  }

  class ElementInternalsFeatureDetection extends HTMLElement {
    internals: IElementInternals;

    constructor() {
      super();
      this.internals = this.attachInternals();
    }
  }
  const randomName = `element-internals-feature-detection-${Math.random().toString(36).replace(/[^a-z]+/g, '')}`;
  customElements.define(randomName, ElementInternalsFeatureDetection);
  const featureDetectionElement = new ElementInternalsFeatureDetection();
  return [
    'shadowRoot',
    'form',
    'willValidate',
    'validity',
    'validationMessage',
    'labels',
    'setFormValue',
    'setValidity',
    'checkValidity',
    'reportValidity'
  ].every(prop => prop in featureDetectionElement.internals);
}

if (!isElementInternalsSupported()) {
  /** @ts-expect-error: we need to replace the default ElementInternals */
  window.ElementInternals = ElementInternals;

  const define = customElements.define;
  customElements.define = function (name, constructor, options) {
    if (constructor.formAssociated) {
      const connectedCallback = constructor.prototype.connectedCallback;
      constructor.prototype.connectedCallback = function () {
        if (!connectedCallbackMap.has(this)) {
          connectedCallbackMap.set(this, true);

          if (this.hasAttribute('disabled')) {
            setDisabled(this, true);
          }
        }

        connectedCallback?.apply(this);
      };
    }

    define.apply(customElements, [name, constructor, options]);
  }

  function attachShadowObserver(...args) {
    const shadowRoot = attachShadow.apply(this, args);
    const observer = new MutationObserver(observerCallback);
    shadowRootMap.set(this, shadowRoot);
    if (window.ShadyDOM) {
      observer.observe(this, observerConfig);
    } else {
      observer.observe(shadowRoot, observerConfig);
    }
    shadowHostsMap.set(this, observer);
    return shadowRoot;
  }

  function checkValidityOverride(...args): boolean {
    let returnValue = checkValidity.apply(this, args);
    return overrideFormMethod(this, returnValue, 'checkValidity');
  }

  function reportValidityOverride(...args): boolean {
    let returnValue = reportValidity.apply(this, args);
    return overrideFormMethod(this, returnValue, 'reportValidity');
  }

  /**
   * Attaches an ElementInternals instance to a custom element. Calling this method
   * on a built-in element will throw an error.
   */
  HTMLElement.prototype.attachInternals = function(): IElementInternals {
    if (!this.tagName) {
      /** This happens in the LitSSR environment. Here we can generally ignore internals for now */
      return {} as unknown as IElementInternals;
    } else if (this.tagName.indexOf('-') === -1) {
      throw new Error(`Failed to execute 'attachInternals' on 'HTMLElement': Unable to attach ElementInternals to non-custom elements.`);
    }
    if (internalsMap.has(this)) {
      throw new DOMException(`DOMException: Failed to execute 'attachInternals' on 'HTMLElement': ElementInternals for the specified element was already attached.`);
    }
    return new ElementInternals(this) as IElementInternals;
  }

  const attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = attachShadowObserver;

  const documentObserver = new MutationObserver(observerCallback);
  documentObserver.observe(document.documentElement, observerConfig);

  const checkValidity = HTMLFormElement.prototype.checkValidity;
  HTMLFormElement.prototype.checkValidity = checkValidityOverride;

  const reportValidity = HTMLFormElement.prototype.reportValidity;
  HTMLFormElement.prototype.reportValidity = reportValidityOverride;

  const { get } = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'elements');
  Object.defineProperty(HTMLFormElement.prototype, 'elements', {
    get(...args) {
      const elements = get.call(this, ...args);
      const polyfilledElements = Array.from(formElementsMap.get(this) || []);

      // If there are no polyfilled elements, return the native elements collection
      if (polyfilledElements.length === 0) {
        return elements;
      }

      // Merge the native elements with the polyfilled elements
      // and order them by their position in the DOM
      const orderedElements = Array.from(elements).concat(polyfilledElements).sort((a: Element, b: Element) => {
        if (a.compareDocumentPosition) {
          return a.compareDocumentPosition(b) & 2 ? 1 : -1;
        }
        return 0;
      });

      return new HTMLFormControlsCollection(orderedElements);
    },
  });

  if (!window.CustomStateSet) {
    window.CustomStateSet = CustomStateSet;
  }
} else if (!window.CustomStateSet) {
  window.CustomStateSet = CustomStateSet;
  const attachInternals = HTMLElement.prototype.attachInternals;
  HTMLElement.prototype.attachInternals = function(...args) {
    const internals = attachInternals.call(this, args);
    internals.states = new CustomStateSet(this);
    return internals;
  }
}
