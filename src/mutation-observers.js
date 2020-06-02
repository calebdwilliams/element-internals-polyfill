import { internalsMap, shadowHostsMap, upgradeMap } from './maps.js';
import { aom } from './aom.js';
import { initForm, initLabels } from './utils.js';

export function observerCallback(mutationList) {
  mutationList.forEach(mutationRecord => {
    const { addedNodes, removedNodes } = mutationRecord;
    Array.from(addedNodes).forEach(node => {
      if (internalsMap.has(node)) {
        const internals = internalsMap.get(node);
        const { form } = internals;

        initForm(node, form, internals);
        initLabels(node, internals.labels);
      }

      if (upgradeMap.has(node)) {
        const internals = upgradeMap.get(node);
        const aomKeys = Object.keys(aom);
        aomKeys
          .filter(key => internals[key] !== null)
          .forEach(key => {
            console.log({key})
            node.setAttribute(aom[key], internals[key]);
          });
        upgradeMap.delete(node);
      }
    });

    Array.from(removedNodes).forEach(node => {
      if (shadowHostsMap.has(node)) {
        const observer = shadowHostsMap.get(node);
        observer.disconnect();
      }
    });
  })
}

export function attachShadowObserverfunction(...args) {
  const shadowRoot = attachShadow.apply(this, args);
  const observer = new MutationObserver(observerCallback);
  observer.observe(shadowRoot, {
    childList: true,
    subtree: true
  });
  return shadowRoot;
}

export const observer = new MutationObserver(observerCallback);
export const observerConfig = {
  childList: true,
  subtree: true
};
