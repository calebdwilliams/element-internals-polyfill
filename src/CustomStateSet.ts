import { ICustomElement } from "./types";

/** Save a reference to the ref for teh CustomStateSet */
const customStateMap = new WeakMap<CustomStateSet, ICustomElement>();

export class CustomStateSet extends Set<string> {
  constructor(ref: ICustomElement) {
    super();
    if (!ref || !ref.tagName || ref.tagName.indexOf('-') === -1) {
      throw new TypeError('Illegal constructor');
    }

    customStateMap.set(this, ref);
  }

  add(state: string) {
    if (!/^--/.exec(state) || typeof state !== 'string') {
      throw new DOMException(`Failed to execute 'add' on 'CustomStateSet': The specified value ${state} must start with '--'.`);
    }
    const result = super.add(state);
    const ref = customStateMap.get(this);
    ref.toggleAttribute(`state${state}`, true);
    return result;
  }

  clear() {
    for (let [entry] of this.entries()) {
      this.delete(entry);
    }
    super.clear();
  }

  delete(state: string) {
    const result = super.delete(state);
    const ref = customStateMap.get(this);
    ref.toggleAttribute(`state${state}`, false);
    return result;
  }
}
