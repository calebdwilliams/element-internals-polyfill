import { internalsMap, shadowHostsMap, upgradeMap, hiddenInputMap, documentFragmentMap } from './maps.js';
import { aom } from './aom.js';
import { removeHiddenInputs, initForm, initLabels, upgradeInternals } from './utils.js';
import { ICustomElement } from './types.js';

export function observerCallback(mutationList: MutationRecord[]) {
  mutationList.forEach(mutationRecord => {
    const { addedNodes, removedNodes } = mutationRecord;
    const added = Array.from(addedNodes) as ICustomElement[];
    const removed = Array.from(removedNodes) as ICustomElement[];

    added.forEach(node => {
      /** Allows for dynamic addition of elements to forms */
      if (internalsMap.has(node) && node.constructor['formAssociated']) {
        const internals = internalsMap.get(node);
        const { form } = internals;

        initForm(node, form, internals);
        initLabels(node, internals.labels);
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
  })
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
  const observer = new MutationObserver(fragmentObserverCallback)
  observer.observe(fragment, { childList: true });
  documentFragmentMap.set(fragment, observer);
};

export const observer = new MutationObserver(observerCallback);
export const observerConfig: MutationObserverInit = {
  childList: true,
  subtree: true
};
