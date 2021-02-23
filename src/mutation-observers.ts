import { internalsMap, shadowHostsMap, upgradeMap, hiddenInputMap } from './maps.js';
import { aom } from './aom.js';
import { removeHiddenInputs, initForm, initLabels } from './utils.js';
import { ICustomElement } from './types.js';

export function observerCallback(mutationList) {
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

export const observer = new MutationObserver(observerCallback);
export const observerConfig: MutationObserverInit = {
  childList: true,
  subtree: true
};
