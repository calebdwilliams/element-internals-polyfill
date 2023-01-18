export class HTMLFormInternalsCollection {
  #elements;

  constructor(elements) {
    this.#elements = elements;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];

      this[i] = element;
      if (element.hasAttribute('name')) {
        this[element.getAttribute('name')] = element;
      }
    }

    Object.defineProperty(this, 'length', {
      get: function () {
        return elements.length;
      },
    });

    // Make it immutable
    Object.freeze(this);
  }

  [Symbol.iterator]() {
    let index = -1;

    return {
      next: () => {
        return {
          value: this.#elements[++index],
          done: !(index in this.#elements)
        };
      },
    };
  }

  item(i) {
    return this[i];
  }

  namedItem(name) {
    return this[name];
  }
}
