import { internalsMap, shadowHostsMap, upgradeMap, hiddenInputMap, documentFragmentMap, formElementsMap, validityUpgradeMap, refValueMap } from './maps.js';
import { aom } from './aom.js';
import { removeHiddenInputs, initForm, initLabels, upgradeInternals, setDisabled, mutationObserverExists } from './utils.js';
import { ICustomElement } from './types.js';

function initNode(node: ICustomElement): void {
  const internals = internalsMap.get(node);
  const { form } = internals;
  initForm(node, form, internals);
  initLabels(node, internals.labels);
}

/**
 * If a fieldset's disabled state is toggled, the formDisabledCallback
 * on any child form-associated cusotm elements.
 */
export const walkFieldset = (node: HTMLFieldSetElement, firstRender: boolean = false): void => {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node: ICustomElement): number {
      return internalsMap.has(node) ?
        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });

  let current = walker.nextNode() as ICustomElement;
  /**
   * We don't need to call anything on first render if
   * the element isn't disabled
   */
  const isCallNecessary = (!firstRender || node.disabled)

  while (current) {
    if (current.formDisabledCallback && isCallNecessary) {
      setDisabled(current, node.disabled);
    }
    current = walker.nextNode() as ICustomElement;
  }
};

export const disabledOrNameObserverConfig: MutationObserverInit = { attributes: true, attributeFilter: ['disabled', 'name'] };

export const disabledOrNameObserver = mutationObserverExists() ? new MutationObserver((mutationsList: MutationRecord[]) => {
  for (const mutation of mutationsList) {
    const target = mutation.target as ICustomElement;

    /** Manage changes to the ref's disabled state */
    if (mutation.attributeName === 'disabled') {
      if (target.constructor['formAssociated']) {
        setDisabled(target, target.hasAttribute('disabled'));
      } else if (target.localName === 'fieldset') {
        /**
         * Repurpose the observer for fieldsets which need
         * to be walked whenever the disabled attribute is set
         */
        walkFieldset(target as unknown as HTMLFieldSetElement);
      }
    }
    /** Manage changes to the ref's name */
    if (mutation.attributeName === 'name') {
      if (target.constructor['formAssociated']) {
        const internals = internalsMap.get(target);
        const value = refValueMap.get(target);
        internals.setFormValue(value);
      }
    }
  }
}) : {} as MutationObserver;

export function observerCallback(mutationList: MutationRecord[]) {
  mutationList.forEach(mutationRecord => {
    const { addedNodes, removedNodes } = mutationRecord;
    const added = Array.from(addedNodes) as ICustomElement[];
    const removed = Array.from(removedNodes) as ICustomElement[];

    added.forEach(node => {
      /** Allows for dynamic addition of elements to forms */
      if (internalsMap.has(node) && node.constructor['formAssociated']) {
        initNode(node);
      }


      /** Upgrade the accessibility information on any previously connected */
      if (upgradeMap.has(node)) {
        const internals = upgradeMap.get(node);
        const aomKeys = Object.keys(aom);
        aomKeys
          .filter(key => internals[key] !== null)
          .forEach(key => {
            node.setAttribute(aom[key], internals[key]);
          });
        upgradeMap.delete(node);
      }

      /** Upgrade the validity state when the element is connected */
      if (validityUpgradeMap.has(node)) {
        const internals = validityUpgradeMap.get(node);
        node.setAttribute('internals-valid', internals.validity.valid.toString());
        node.setAttribute('internals-invalid', (!internals.validity.valid).toString());
        node.setAttribute('aria-invalid', (!internals.validity.valid).toString());
        validityUpgradeMap.delete(node);
      }

      /** If the node that's added is a form, check the validity */
      if (node.localName === 'form') {
        const formElements = formElementsMap.get(node as unknown as HTMLFormElement);
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
          acceptNode(node: ICustomElement): number {
            return (
              internalsMap.has(node) && node.constructor['formAssociated'] && !(formElements && formElements.has(node))
            ) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
        });

        let current = walker.nextNode() as ICustomElement;

        while (current) {
          initNode(current);
          current = walker.nextNode() as ICustomElement;
        }
      }

      if (node.localName === 'fieldset') {
        disabledOrNameObserver.observe?.(node, disabledOrNameObserverConfig);
        walkFieldset(node as unknown as HTMLFieldSetElement, true);
      }
    });

    removed.forEach(node => {
      const internals = internalsMap.get(node);
      /** Clean up any hidden input elements left after an element is disconnected */
      if (internals && hiddenInputMap.get(internals)) {
        removeHiddenInputs(internals);
      }
      /** Disconnect any unneeded MutationObservers */
      if (shadowHostsMap.has(node)) {
        const observer = shadowHostsMap.get(node);
        observer.disconnect();
      }
    });
  });
}

/**
 * This observer callback is just for document fragments
 * it will upgrade an ElementInternals instance if was appended
 * from a document fragment.
 */
export function fragmentObserverCallback(mutationList: MutationRecord[]): void {
  mutationList.forEach(mutation => {
    const { removedNodes } = mutation;

    removedNodes.forEach(node => {
      const observer = documentFragmentMap.get(mutation.target as DocumentFragment);
      if (internalsMap.has(node as ICustomElement)) {
        upgradeInternals(node as ICustomElement);
      }
      observer.disconnect();
    });
  });
}

/**
 * Defer the upgrade of nodes withing a DocumentFragment
 * @param fragment {DocumentFragment}
 */
 export const deferUpgrade = (fragment: DocumentFragment) => {
  const observer = new MutationObserver(fragmentObserverCallback);
  // is this using shady DOM and is not actually a DocumentFragment?
  if (
    window?.ShadyDOM?.inUse &&
    (fragment as unknown as { mode: string }).mode &&
    (fragment as unknown as { host: HTMLElement | null }).host
  ) {
    // using shady DOM polyfill. Best to just observe the host.
    fragment = (fragment as ShadowRoot).host as unknown as DocumentFragment;
  }
  observer.observe?.(fragment, { childList: true });
  documentFragmentMap.set(fragment, observer);
 };

export const observer = mutationObserverExists() ? new MutationObserver(observerCallback) : {} as MutationObserver;
export const observerConfig: MutationObserverInit = {
  childList: true,
  subtree: true
};
