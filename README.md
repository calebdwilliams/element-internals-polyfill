# Element Internals Polyfill

This package is a polyfill for the [`ElementInternals` standard](https://html.spec.whatwg.org/multipage/custom-elements.html#the-elementinternals-interface). The specification is supported by current releases of Google's Chrome.

## Use case

The primary use case for `ElementInternals` right now is allowing custom elements full participation in HTML forms. To do this, it provides any element designated as `formAssociated` access to a handful of utilities.


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

Right now providing a cross-browser compliant version of `ElementInternals.reportValidity` is not supported. The method essentially behaves as a proxy for `ElementInternals.checkValidity`.