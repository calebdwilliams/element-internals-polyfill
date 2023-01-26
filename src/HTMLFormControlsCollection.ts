export class HTMLFormControlsCollection implements globalThis.HTMLFormControlsCollection {
  readonly #elements;

  constructor(elements) {
    this.#elements = elements;

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];

      this[i] = element;
      if (element.hasAttribute('name')) {
        this[element.getAttribute('name')] = element;
      }
    }

    Object.freeze(this);
  }

  [index: number]: Element;

  get length(): number {
    return this.#elements.length;
  }

  [Symbol.iterator]() {
    return this.#elements[Symbol.iterator]();
  }

  item(i): Element {
    return this[i] ?? null;
  }

  namedItem(name): Element {
    return this[name] ?? null;
  }
}
