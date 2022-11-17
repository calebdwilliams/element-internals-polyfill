import {
  elementUpdated,
  expect,
  fixture,
  fixtureCleanup,
  html,
} from '@open-wc/testing';
import '../dist/index.js';

let callCount = 0;
let internalsAvailableInFormAssociatedCallback = false;

window.onFormSubmit = (event) => {
  event.preventDefault();
  callCount += 1;
};

class CustomElement extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.internals = this.attachInternals();
    root.innerHTML = '<input>';

    this._value = '';
  }

  connectedCallback() {
    this.tabIndex = -1;
    this.input = this.shadowRoot.querySelector('input');
  }

  set disabled(disabled) {
    this._disabled = disabled;
    this.toggleAttribute('disabled', disabled);
  }

  get disabled() {
    return this._disabled;
  }

  set required(required) {
    this._required = required;
    this.toggleAttribute('required', required);
    if (!this.value) {
      this.internals.setValidity({
        valueMissing: true
      }, 'This field is required');
    } else {
      this.internals.setValidity({
        valueMissing: false
      });
    }
  }

  get required() {
    return this._required;
  }

  set value(value) {
    this._value = value;
    this.internals.setFormValue(value);
  }

  get value() {
    return this._value;
  }

  formAssociatedCallback() {
    internalsAvailableInFormAssociatedCallback = !!this.internals;
  }

  formDisabledCallback() {
    callCount += 1;
  }
  formResetCallback() {
    callCount += 1;
  }

  checkValidity() { return this.internals.checkValidity(); }
  reportValidity() { return this.internals.reportValidity(); }
}

customElements.define('test-el', CustomElement);

describe('The ElementInternals polyfill', () => {
  describe('form validity', () => {
    let form, input;
    const simultateEvent = (eventType, value = undefined, options = {"bubbles":true, "cancelable":false}) => {
      input.value = value;
      input.required = input.required;
      input.dispatchEvent(new Event(eventType, options));
    }

    beforeEach(async () => {
      form = await fixture(`<form><test-el></test-el></form>`);
      input = form.querySelector('test-el');
      input.required = true;
      simultateEvent('input');
    });

    afterEach(async () => {
      await fixtureCleanup(form);
    });

    it('form should be invalid when form-associated custom element is invalid', () => {
      expect(form.checkValidity()).to.be.false;
    });

    it('checkValidity will be true if the element is disabled', () => {
      input.toggleAttribute('disabled', true);
      expect(input.checkValidity()).to.be.true;
    });

    it('checkValidity will be true if the element is readOnly', async () => {
      input.toggleAttribute('readonly', true);
      /** Inconsistent behavior in Chrome version, bug reported */
      if (ElementInternals.isPolyfilled) {
        expect(input.checkValidity()).to.be.true;
      }
    });

    it('form should match form:invalid CSS selector when form-associated custom element is invalid', () => {
      expect(form.matches('form:is(:invalid, [internals-invalid])')).to.be.true;
    });

    it('After input event, form should be valid if all inputs are invalid', () => {
      simultateEvent('input', 'test');
      expect(form.checkValidity()).to.be.true;
    });

    it('After input event, form should match form:valid CSS selector if all inputs are valid', () => {
      simultateEvent('input', 'test');
      expect(form.matches('form:is(:valid:not([internals-invalid]), [internals-valid])')).to.be.true;
    });

    it('After change event, form should be valid if all inputs are invalid', () => {
      simultateEvent('change', 'test');
      expect(form.checkValidity()).to.be.true;
    });

    it('After change event, form should match form:valid CSS selector if all inputs are valid', () => {
      simultateEvent('change', 'test');
      expect(form.matches('form:is(:valid:not([internals-invalid]), [internals-valid])')).to.be.true;
    });

  });

  describe('outside the proper context', () => {
    let el, internals;

    beforeEach(async () => {
      el = await fixture(html`<test-el></test-el>`);
      internals = el.internals;
    });

    afterEach(async () => {
      await fixtureCleanup(el);
    });

    it('will throw if called directly', () => {
      expect(() => {
        new ElementInternals()
      }).to.throw();
    });

    it('will throw if called by a non custom element', async () => {
      const el = await fixture(html`<div></div>`);
      expect(() => el.attachInternals()).to.throw();
    });
  });

  describe('Non-formAssociated elements', () => {
    let element, internals;

    class NotFormAssociated extends HTMLElement {
      constructor() {
        super();
        this.internals = this.attachInternals();
      }
    }

    customElements.define('not-associated', NotFormAssociated);

    beforeEach(async () => {
      element = await fixture(html`<not-associated></not-associated>`);
    });

    afterEach(async () => await fixtureCleanup(element));

    it('will attach an object to internals even if not form associated', async () => {
      expect(element.internals).to.exist;
    });

    it('will throw from setFormValue', async () => {
      expect(() => element.internals.setFormValue('foo')).to.throw();
    });
  });

  describe('inside a custom element with a form', () => {
    let form, el, noname, label, button, internals;

    beforeEach(async () => {
      form = await fixture(html`
        <form id="form">
          <label for="foo">Label text</label>
          <test-el name="foo" id="foo"></test-el>
          <test-el id="noname"></test-el>
          <button type="submit">Submit</button>
        </form>
      `);
      callCount = 0;
      label = form.querySelector('label');
      el = form.querySelector('test-el[id=foo]');
      noname = form.querySelector('test-el[id=noname]');
      button = form.querySelector('button');
      internals = el.internals;
    });

    afterEach(async () => {
      fixtureCleanup(form)
    });

    it('will have the proper structure with a form', () => {
      expect(internals.form).to.equal(form);
    });

    it('will be valid by default', () => {
      expect(internals.validity.valid).to.be.true;
      expect(internals.checkValidity()).to.be.true;
    });

    it('will be invalid if the validity has been set to false', () => {
      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.validity.valid).to.be.false;
      expect(internals.checkValidity()).to.be.false;
    });

    it('will be valid if toggled back to true from false', () => {
      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.validity.valid).to.be.false;
      expect(internals.checkValidity()).to.be.false;

      internals.setValidity({
        valueMissing: false
      });

      expect(internals.validity.valid).to.be.true;
      expect(internals.checkValidity()).to.be.true;
    });

    it('will set the validation message from a call to setValidity', () => {
      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.validationMessage).to.equal('This field is required');
    });

    it('will unset the validation message from a call to setValidity', () => {
      internals.setValidity({
        valueMissing: true
      }, 'This field is required');

      expect(internals.validationMessage).to.equal('This field is required');

      internals.setValidity({ valueMissing: false });
      expect(internals.validationMessage).to.equal('');
    });

    it('will reset validity if an object literal is passed to setValidity', () => {
      internals.setValidity({
        valueMissing: true
      }, 'This field is required');
      expect(internals.validity.valid).to.be.false;
      internals.setValidity({});
      expect(internals.validity.valid).to.be.true;
    });

    it('will throw if setValidity is called with a flag and no validation message', () => {
      expect(() => {
        internals.setValidity({
          valueMissing: true
        });
      }).to.throw();
    });

    it('will accept ValidityState from a native form input', () => {
      el.input.required = true;
      el.input.reportValidity();
      internals.setValidity(el.input.validity, el.input.validationMessage, el.input);
      expect(internals.validity.valueMissing).to.be.true;
    });

    it('will return true for willValidate if the field can participate in the form', () => {
      expect(internals.willValidate).to.be.true;
    });

    it('will return false from willValidate if the field is disabled', async () => {
      el.disabled = true;
      await elementUpdated(el);
      expect(internals.willValidate).to.be.false;
      if (ElementInternals.isPolyfilled) {
        expect(el.getAttribute('aria-disabled')).to.equal('true');
      }
    });

    it('will participate in forms', async () => {
      el.value = 'testing';
      expect(new FormData(form).get('foo')).to.equal('testing');
    });

    it('will trigger the formDisabledCallback when disabled', async () => {
      el.disabled = true;
      await elementUpdated(el);
      // Lifecycle methods are stripped off at definition time
      // and added elsewhere so we can't use a spy. Instead
      // we're going to look for a side-effect
      expect(callCount).to.equal(1);
    });

    it('will respond to form reset events', async () => {
      form.reset();
      // Lifecycle methods are stripped off at definition time
      // and added elsewhere so we can't use a spy. Instead
      // we're going to look for a side-effect
      expect(callCount).to.equal(2);
    });

    it('will cancel form submission if invalid', (done) => {
      el.addEventListener('invalid', event => {
        expect(event).to.exist;
        done();
      });
      internals.setValidity({
        valueMissing: true
      }, 'This field is required');
      button.click();
    });

    it('will wire up labels', async () => {
      expect([...internals.labels]).to.deep.equal([label]);
    });

    it('will dispatch an invalid event on checkValidity if invalid', (done) => {
      el.addEventListener('invalid', event => {
        expect(event).to.exist;
        done();
      });
      internals.setValidity({
        valueMissing: true
      }, 'This field is required');
      el.internals.checkValidity();
    });

    it('will call formAssociatedCallback after internals have been set', () => {
      expect(internalsAvailableInFormAssociatedCallback).to.be.true;
    });

    it('will not include null values set via setFormValue', () => {
      internals.setFormValue('test');
      internals.setFormValue(null);
      const output = new FormData(form);
      expect(Array.from(output.keys()).length).to.equal(0);
    });

    it('will not include undefined values set via setFormValue', () => {
      internals.setFormValue('test');
      internals.setFormValue(undefined);
      const output = new FormData(form);
      expect(Array.from(output.keys()).length).to.equal(0);
    });

    it('will include multiple form values passed via FormData to setFormValue', () => {
      let input;
      let output;
      input = new FormData();
      input.set('first', '1');
      input.set('second', '2');
      input.append('second', '22'); // Multi-value keys should also work
      internals.setFormValue(input);
      output = new FormData(form);
      expect(Array.from(output.values()).length).to.equal(3);
      expect(output.get('first')).to.equal('1');
      expect(output.getAll('second').length).to.equal(2);
      input = new FormData();
      input.set('override', '3');
      internals.setFormValue(input);
      output = new FormData(form);
      expect(Array.from(output.keys()).length).to.equal(1);
      expect(output.get('override')).to.equal('3');
    });

    it('will not include form values from elements without a name', () => {
      noname.internals.setFormValue('noop');
      const output = new FormData(form);
      expect(Array.from(output.keys()).length).to.equal(0);
    });

    it('will include form values from elements without a name if set with FormData', () => {
      const formData = new FormData();
      formData.set('formdata', 'works');
      noname.internals.setFormValue(formData);
      const output = new FormData(form);
      expect(Array.from(output.keys()).length).to.equal(1);
      expect(output.get('formdata')).to.equal('works');
    });

    it('will append FormData in correct order', () => {
      const formData = new FormData();
      formData.append('one', '1')
      formData.append('two', '2')
      noname.internals.setFormValue(formData);
      const output = new FormData(form);

      expect(Array.from(output.keys())).to.eql(['one', 'two'])
    });

    it('saves a reference to all shadow roots', () => {
      expect(internals.shadowRoot).to.equal(el.shadowRoot);
    });

    it('will focus the element if validated with anchor', async () => {
      internals.setValidity({
        customError: true
      }, 'Error message', el.input);
      internals.reportValidity();
      expect(document.activeElement).to.equal(el);
    });

    it('will focus anchor elements in document order on form submission failure', () => {
      internals.setValidity({
        customError: true
      }, 'Error message', el.input);
      noname.internals.setValidity({
        customError: true
      }, 'Error message', noname.input);
      button.click();
      expect(document.activeElement).to.equal(el);
    });

    it('will accept non strings', async () => {
      internals.setFormValue(['a', 'b']);
      expect(
        new FormData(internals.form).get('foo')
      ).to.equal('a,b');
    });

    it('will accept empty strings', () => {
      internals.setFormValue('');
      expect(new FormData(internals.form).get('foo')).to.equal('');
    });

    it('will set the form to the proper validity state', async () => {
      internals.setValidity({ valueMissing: true }, 'Error message');
      expect(form.checkValidity()).to.be.false;
      expect(form.reportValidity()).to.be.false;

      internals.setValidity({});
      expect(form.checkValidity()).to.be.true;
      expect(form.reportValidity()).to.be.true;
    });
  });

  describe('inside a custom element with a form and containing fieldset', () => {
    let form, els, fieldset;

    beforeEach(async () => {
      form = await fixture(html`
        <form id="form">
          <fieldset id="fieldset">
            <label>Label text
              <test-el name="foo" id="foo"></test-el>
            </label>
            <label for="bar">Label text</label>
            <test-el name="bar" id="bar"></test-el>
          </fieldset>
        </form>
        `);
      fieldset = form.querySelector('fieldset');
      els = form.querySelectorAll('test-el');
    });

    it('sets aria-disabled when the fieldset is disabled', function() {
      fieldset.toggleAttribute('disabled', true);
      for (const el of els) {
        expect(el.getAttribute('aria-disabled')).to.equal('true');
      }
    });

    afterEach(async () => {
      fixtureCleanup(form)
    });
  });

  describe('closed shadow root element', () => {
    let shadowRoot;
    let el;
    let internals;

    class ClosedRoot extends HTMLElement {
      constructor() {
        super();
        shadowRoot = this.attachShadow({ mode: 'closed' });
        this.internals = this.attachInternals();
      }
    }

    customElements.define('closed-root', ClosedRoot);

    beforeEach(async () => {
      el = await fixture(html`<closed-root></closed-root>`);
      internals = el.internals;
    });

    afterEach(async () => {
      await fixtureCleanup(el);
    });

    it('maintains a reference to closed shadow roots', () => {
      expect(internals.shadowRoot).to.equal(shadowRoot);
    });
  });

  describe('Forms with onsubmit', () => {
    let form;
    let el;
    let internals;
    let button;

    beforeEach(async () => {
      form = await fixture(html`<form onsubmit="onFormSubmit(event)">
        <test-el></test-el>
        <button type="submit">Submit</button>
      </form>`);
      el = form.querySelector('test-el');
      internals = el.internals;
      button = form.querySelector('button');
      callCount = 0;
    });

    it('will not call onsubmit if invalid', async () => {
      expect(callCount).to.equal(0);
      internals.setValidity({ valueMissing: true }, 'Error message');
      button.click();
      expect(callCount).to.equal(0);
    });

    it('will call onsubmit if valid', async () => {
      expect(callCount).to.equal(0);
      internals.setValidity({});
      button.click();
      expect(callCount).to.equal(1);
    });
  });

  describe('Forms with novalidate', () => {
    it('will not block submit', async () => {
      let submitCount = 0;
      const onSubmit = (event) => {
        event.preventDefault();
        submitCount += 1;
      }
      const form = await fixture(html`<form novalidate @submit="${onSubmit}">
        <test-el name="foo" id="foo"></test-el>
        <button type="submit">Submit</button>
      </form>`);
      const testEl = form.querySelector('test-el');
      const button = form.querySelector('button');
      testEl.internals.setValidity({
        customError: true
      }, 'error message');
      button.click();
      expect(submitCount).to.equal(1);
    });
  });

  describe('forms outside closed custom elements', () => {
    it('will not find forms outside of closed custom element', async () => {
      class ClosedElementWithCustomFormElement extends HTMLElement {
        constructor() {
          super();
          this.renderRoot = this.attachShadow({ mode: 'closed' });
          this.renderRoot.innerHTML = `<test-el name="foo" id="foo"></test-el>`;
        }
      }
      customElements.define('closed-element-with-custom-form-element', ClosedElementWithCustomFormElement);

      const form = await fixture(html`<form>
        <closed-element-with-custom-form-element></closed-element-with-custom-form-element>
      </form>`);
      const shadowElement = form.querySelector('closed-element-with-custom-form-element');
      const testEl = shadowElement.renderRoot.querySelector("test-el")
      expect(testEl.internals.form).to.be.null;
    });
  });
});
