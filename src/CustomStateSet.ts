/** Save a reference to the ref for the CustomStateSet */
const customStateMap = new WeakMap<CustomStateSet, HTMLElement>();

function addState(ref: HTMLElement, stateName: string): void {
  ref.toggleAttribute(stateName, true);
  if (ref.part) {
    ref.part.add(stateName);
  }
}

export type CustomState = `--${string}`;

export class CustomStateSet extends Set<CustomState> {
  static get isPolyfilled() {
    return true;
  }

  constructor(ref: HTMLElement) {
    super();
    if (!ref || !ref.tagName || ref.tagName.indexOf("-") === -1) {
      throw new TypeError("Illegal constructor");
    }

    customStateMap.set(this, ref);
  }

  add(state: CustomState) {
    if (!/^--/.test(state) || typeof state !== "string") {
      throw new DOMException(
        `Failed to execute 'add' on 'CustomStateSet': The specified value ${state} must start with '--'.`
      );
    }
    const result = super.add(state);
    const ref = customStateMap.get(this);
    const stateName = `state${state}`;

    /**
     * Only add the state immediately if the ref is connected to the DOM;
     * otherwise, wait a tick because the element is likely being constructed
     * by document.createElement and would throw otherwise.
     */
    if (ref.isConnected) {
      addState(ref, stateName);
    } else {
      setTimeout(() => {
        addState(ref, stateName);
      });
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

    /**
     * Only toggle the state/attr immediately if the ref is connected to the DOM;
     * otherwise, wait a tick because the element is likely being constructed
     * by document.createElement and would throw otherwise.
     */
    if (ref.isConnected) {
      ref.toggleAttribute(`state${state}`, false);
      if (ref.part) {
        ref.part.remove(`state${state}`);
      }
    } else {
      setTimeout(() => {
        ref.toggleAttribute(`state${state}`, false);
        if (ref.part) {
          ref.part.remove(`state${state}`);
        }
      });
    }

    return result;
  }
}
