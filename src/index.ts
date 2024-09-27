import {
  ElementInternals,
  forceCustomStateSetPolyfill,
  forceElementInternalsPolyfill,
  isElementInternalsSupported,
} from "./element-internals.js";
import { CustomStateSet } from "./CustomStateSet.js";
import "./element-internals.js";

export * from "./types.js";
export {
  forceCustomStateSetPolyfill,
  forceElementInternalsPolyfill,
} from "./element-internals.js";

declare global {
  interface Window {
    CustomStateSet: typeof CustomStateSet;
    ElementInternals: typeof ElementInternals;
    ShadyDOM: any;
  }
  interface HTMLElement {
    /**
     * Attaches an ElementInternals instance to a custom element. Calling this method
     * on a built-in element will throw an error.
     */
    attachInternals(): ElementInternals;
  }
}

// Deteermine whether the webcomponents polyfill has been applied.
const isCePolyfill = !!(
  customElements as unknown as {
    polyfillWrapFlushCallback: () => void;
  }
).polyfillWrapFlushCallback;

// custom elements polyfill is on. Do not auto-apply. User should determine
// whether to force or not.
if (!isCePolyfill) {
  if (!isElementInternalsSupported()) {
    forceElementInternalsPolyfill(false);
  } else if (typeof window !== "undefined" && !window.CustomStateSet) {
    forceCustomStateSetPolyfill(HTMLElement.prototype.attachInternals);
  }
}
