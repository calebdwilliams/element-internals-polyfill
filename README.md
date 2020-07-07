# Element Internals Polyfill

This package is a polyfill for the [`ElementInternals` standard](https://html.spec.whatwg.org/multipage/custom-elements.html#the-elementinternals-interface). The specification is supported by current releases of Google's Chrome.

## Use case

The primary use case for `ElementInternals` right now is allowing custom elements full participation in HTML forms. To do this, it provides any element designated as `formAssociated` access to a handful of utilities.

## Installation

This package is available on `npm` under the name `element-internals-polyfill`
and can be installed with [npm](https://docs.npmjs.com/getting-started),
[yarn](https://yarnpkg.com/en/docs/getting-started), [unpkg](https://unpkg.com)
or however else you consume dependencies.

### Example commands: 

npm:
```bash
npm i element-internals-polyfill
```

yarn:
```bash
yarn add element-internals-polyfill
```

unpkg:
```javascript
import 'https://unpkg.com/element-internals-polyfill';
```

## How it works

To do this, add the `static get formAssociated` to a custom element and call the `attachInternals` method to return a new instance of the `ElementInternals` interface:

```javascript
class MyInput extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
  }
}
```

This works by doing several things under the hood. First, there is a feature check for the `ElementInternals` object on the window. If that does not exist, the polyfill wires up a global [`MutationObserver`](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) on the document to watch for additions to the DOM that the polyfill might need.

It also monkey-patches `HTMLElement.prototype.attachShadow` to wire up a similar listener on any created shadow roots and to remove the watcher if the shadow root is removed.

The polyfill will also monkey-patch `window.FormData` to attach any custom elements to that feature as well.

The currently-supported features of `ElementInternals` for form-associated custom elements are

## Current limitations

- Right now providing a cross-browser compliant version of `ElementInternals.reportValidity` is not supported. The method essentially behaves as a proxy for `ElementInternals.checkValidity`.
- The polyfill does support the outcomes of the [Accessibility Object Model](https://wicg.github.io/aom/explainer.html#) for applying accessibility rules on the DOM object. However, the spec states that updates using AOM will not be reflected by DOM attributes, but only on the element's accesibility object. However, to emulate this behavior before it is fully supported, it is necessary to use the attributes. If you choose to use this feature, please note that behavior in polyfilled browsers and non-polyfilled browsers will be different; however, the outcome for users will be the same.
