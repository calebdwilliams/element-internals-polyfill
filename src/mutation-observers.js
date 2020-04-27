import { internalsMap, shadowHostsMap } from './maps.js';
import { initForm } from './utils.js';

export function observerCallback(mutationList) {
  mutationList.forEach(mutationRecord => {
    const { addedNodes, removedNodes } = mutationRecord;
    Array.from(addedNodes).forEach(node => {
      if (internalsMap.has(node)) {
        const internals = internalsMap.get(node);
        const { form } = internals;

        initForm(node, form, internals);
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
