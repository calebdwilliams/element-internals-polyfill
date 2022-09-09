import { ICustomElement } from "./types";

/** Save a reference to the ref for teh CustomStateSet */
const customStateMap = new WeakMap<CustomStateSet, ICustomElement>();

export type CustomState = `--${string}`;

export class CustomStateSet extends Set<CustomState> {
  static get isPolyfilled() {
    return true;
  }

  constructor(ref: ICustomElement) {
    super();
    if (!ref || !ref.tagName || ref.tagName.indexOf('-') === -1) {
      throw new TypeError('Illegal constructor');
    }

    customStateMap.set(this, ref);
  }

  add(state: CustomState) {
    if (!/^--/.test(state) || typeof state !== 'string') {
      throw new DOMException(`Failed to execute 'add' on 'CustomStateSet': The specified value ${state} must start with '--'.`);
    }
    const result = super.add(state);
    const ref = customStateMap.get(this);
    ref.toggleAttribute(`state${state}`, true);
    if (ref.part) {
      ref.part.add(`state${state}`);
    }
    return result;
  }

  clear() {
    for (let [entry] of this.entries()) {
      this.delete(entry);
    }
    super.clear();
  }

  delete(state: CustomState) {
    const result = super.delete(state);
    const ref = customStateMap.get(this);
    ref.toggleAttribute(`state${state}`, false);
    if (ref.part) {
      ref.part.remove(`state${state}`);
    }
    return result;
  }
}
