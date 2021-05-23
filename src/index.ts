import { ElementInternals } from './element-internals';
import './element-internals';
import { CustomStateSet } from './CustomStateSet';
export * from './types';

declare global {
  interface Window {
    CustomStateSet: typeof CustomStateSet;
    ElementInternals: typeof ElementInternals;
  }
  interface Element {
    /**
     * Attaches an ElementInternals instance to a custom element. Calling this method
     * on a built-in element will throw an error.
     */
    attachInternals?: () => ElementInternals
  }
}
