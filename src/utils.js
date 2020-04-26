import { hiddenInputMap, formsMap } from './maps.js';

const observerConfig = { attributes: true };

const observer = new MutationObserver(mutationsList => {
  for (const mutation of mutationsList) {
    const { attributeName, target } = mutation;

    if (attributeName === 'disabled' && target.constructor.formAssociated) {
      if (target.formDisabledCallback) {
        target.formDisabledCallback.apply(target);
      }
    }
  }
});

export const getHostRoot = node => {
  if (node instanceof Document) {
    return node;
  }
  let parent = node.parentNode;
  if (parent && parent.toString() !== '[object ShadowRoot]') {
    parent = getHostRoot(parent);
  }
  return parent;
};

export const initRef = (ref, internals) => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = ref.getAttribute('name');
  ref.after(input);
  hiddenInputMap.set(internals, input);
  return observer.observe(ref, observerConfig);
};

export const initLabels = (ref, labels) => {
  if (labels.length) {
    Array.from(labels).forEach(label =>
      label.addEventListener('click', ref.focus.bind(ref)));
    const firstLabelId = `${labels[0].htmlFor}_Label`;
    labels[0].id = firstLabelId;
    ref.setAttribute('aria-describedby', firstLabelId);
  }
};

export const initForm = (ref, form, internals) => {
  if (form) {
    form.addEventListener('submit', event => {
      if (internals.checkValidity() === false) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
      }
    });

    form.addEventListener('reset', () => {
      if (ref.constructor.formAssociated && ref.formResetCallback) {
        ref.formResetCallback();
      }
    });

    formsMap.set(form, { ref, internals });

    if (ref.formAssociatedCallback) {
      ref.formAssociatedCallback.apply(ref, [form]);
    }
  }
};

export const findParentForm = elem => {
  let parent = elem.parentNode;
  if (parent && parent.tagName !== 'FORM') {
    parent = findParentForm(parent);
  } else if (!parent && elem.toString() === '[object ShadowRoot]') {
    parent = findParentForm(elem.host);
  }
  return parent;
};
