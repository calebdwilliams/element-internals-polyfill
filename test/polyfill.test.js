import { defineCE } from '@open-wc/testing-helpers/src/helpers';
import { stringFixture as fixture } from '@open-wc/testing-helpers/src/stringFixture';

const createCustomElement = (formAssociated, html = '') => {
  class CustomElement extends HTMLElement {
    static get formAssociated() {
      return formAssociated;
    }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      this.internals = this.attachInternals();
      root.innerHTML = html;

      this._value = '';
    }

    set disabled(disabled) {
      this._disabled = disabled;
      this.toggleAttribute('disabled', disabled);
    }

    get disabled() {
      return this._disabled;
    }

    set value(value) {
      this._value = value;
      this.internals.setFormValue(value);
    }

    get value() {
      return this._value;
    }

    formDisabledCallback() {}
    formResetCallback() {}
  }
  return [defineCE(CustomElement), CustomElement];
};

const tagName = 'test';
const renderTag = tag => `<${tag} id="${tagName}" name="${tagName}"></${tag}>`;

describe('The ElementInternals polyfill', () => {
  describe('outside the proper context', () => {
    it('Will throw if called directly', () => {
      expect(() => new ElementInternals()).toThrow(new TypeError('Illegal constructor'));
    });

    it('Will throw if called by a non custom element', () => {
      expect(() => document.createElement('div').attachInternals()).toThrow(new Error(`Failed to execute 'attachInternals' on 'HTMLElement': Unable to attach ElementInternals to non-custom elements.`));
    });
  });

  describe('inside a custom element without a form', () => {
    it('will attach an object to internals even if not form associated', async () => {
      const [tag] = createCustomElement(false);
      const { internals } = await fixture(`<${tag}></${tag}>`);

      expect(internals).toBeDefined();
    });

    it('will return undefined from setFormValue', async () => {
      const [tag] = createCustomElement(true);
      const { internals } = await fixture(`<${tag}></${tag}>`);

      expect(internals.setFormValue('foo')).toBeUndefined();
    });
  });

  describe('inside a custom element with a form', () => {
    it('will have the proper structure with a form', async () => {
      const [tag] = createCustomElement(true);
      const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
      const { internals } = form.querySelector(tag);

      expect(internals.form).toBe(form);
    });

    it('will be valid by default', async () => {
      const [tag] = createCustomElement(true);
      const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
      const { internals } = form.querySelector(tag);

      expect(internals.validity.valid).toBe(true);
      expect(internals.checkValidity()).toBe(true);
    });

    it('checkValidity will return false if the validity has been set to false', async () => {
      const [tag] = createCustomElement(true);
      const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
      const { internals } = form.querySelector(tag);

      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.checkValidity()).toBe(false);
    });

    it('checkValidity can be toggled back to true', async () => {
      const [tag] = createCustomElement(true);
      const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
      const { internals } = form.querySelector(tag);

      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      internals.setValidity({
        valueMissing: false
      });

      expect(internals.checkValidity()).toBe(true);
    });

    it('will set validtation message from call to setValidity if invalid', async () => {
      const [tag] = createCustomElement(true);
      const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
      const { internals } = form.querySelector(tag);

      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.validationMessage).toBe('This field is required');
    });

    it('will unset validtation message from call to setValidity if valid', async () => {
      const [tag] = createCustomElement(true);
      const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
      const { internals } = form.querySelector(tag);

      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.validationMessage).toBe('This field is required');

      internals.setValidity({
        valueMissing: false
      }, 'This field is required');

      expect(internals.validationMessage).toBe('');
    });

    it('will reset validity if an object literal is passed to setValidity', async () => {
      const [tag] = createCustomElement(true);
      const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
      const { internals } = form.querySelector(tag);

      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.checkValidity()).toBe(false);

      internals.setValidity({});

      expect(internals.checkValidity()).toBe(true);
    });
  });

  it('will throw if setValidity is called without any arguments', async () => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
    const { internals } = form.querySelector(tag);

    expect(() => {
      internals.setValidity();
    }).toThrow(new TypeError('Failed to execute \'setValidity\' on \'ElementInternals\': 1 argument required, but only 0 present.'));
  });

  it('will throw if setValidity is called with a flag and no validation message', async () => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
    const { internals } = form.querySelector(tag);

    expect(() => {
      internals.setValidity({ valueMissing: true });
    }).toThrow(
      new DOMException(`Failed to execute 'setValidity' on 'ElementInternals': The second argument should not be empty if one or more flags in the first argument are true.`)
    );
  })

  it('will return true for willValidate if the field is set to participate in the form', async () => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
    const { internals } = form.querySelector(tag);

    expect(internals.willValidate).toBe(true);
  });

  it('will return false for willValidate if the field is disabled', async () => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form"><${tag} disabled></${tag}></form>`);
    const element = form.querySelector(tag);
    expect(element.internals.willValidate).toBe(false);
  });

  it('will participate in forms', async () => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
    const element = form.querySelector(tag);

    element.value = 'testing';

    expect(new FormData(form).get(tagName)).toBe('testing');
  });

  it('will trigger the formDisabledCallback when disabled', async (done) => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
    const element = form.querySelector(tag);
    spyOn(element, 'formDisabledCallback').and.callThrough();
    element.disabled = true;

    setTimeout(() => {
      expect(element.formDisabledCallback).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('will respond to form reset events', async (done) => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
    const element = form.querySelector(tag);
    spyOn(element, 'formResetCallback').and.callThrough();

    const resetEvent = new Event('reset');
    form.dispatchEvent(resetEvent);

    setTimeout(() => {
      expect(element.formResetCallback).toHaveBeenCalled();
    }, 500);
  });

  it('will cancel form submission if invalid', async (done) => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">${renderTag(tag)}</form>`);
    const { internals } = form.querySelector(tag);

    internals.setValidity({
      valueMissing: true
    }, 'This field is required');

    const submitEvent = new Event('submit', { cancelable: true });
    spyOn(submitEvent, 'preventDefault').and.callThrough();
    spyOn(submitEvent, 'stopImmediatePropagation').and.callThrough();
    spyOn(submitEvent, 'stopPropagation').and.callThrough();

    form.dispatchEvent(submitEvent);

    setTimeout(() => {
      expect(submitEvent.preventDefault).toHaveBeenCalled();
      expect(submitEvent.stopImmediatePropagation).toHaveBeenCalled();
      expect(submitEvent.stopPropagation).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('will wire up labels', async (done) => {
    const [tag] = createCustomElement(true);
    const form = await fixture(`<form id="form">
      <label for="${tagName}">Label</label>
      ${renderTag(tag)}
    </form>`);
    const element = form.querySelector(tag);
    const label = form.querySelector('label');

    setTimeout(() => {
      expect(element.internals.labels[0]).toBe(label);
      expect(element.getAttribute('aria-labelledby')).toBe(`${tagName}_Label`);
      expect(label.getAttribute('id', `${tagName}_Label`));
      done();
    }, 500);
  });
});
