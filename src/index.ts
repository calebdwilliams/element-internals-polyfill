import { ElementInternals } from './element-internals';
import './element-internals';
export * from './types';

declare global {
  interface Window {
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
