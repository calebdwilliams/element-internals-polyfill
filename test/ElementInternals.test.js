import {
  elementUpdated,
  expect,
  fixture,
  fixtureCleanup,
  html,
} from '@open-wc/testing';
import '../dist/element-internals.js';

let callCount = 0;

class CustomElement extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.internals = this.attachInternals();
    root.innerHTML = 'html';

    this._value = '';
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

  formDisabledCallback() {
    callCount += 1;
  }
  formResetCallback() {
    callCount += 1;
  }
}

customElements.define('test-el', CustomElement);

describe('The ElementInternals polyfill', () => {
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

  describe('inside a custom element without a form', () => {
    let el, internals;

    class NotFormAssociated extends HTMLElement {
      constructor() {
        super();
        this.internals = this.attachInternals();
      }
    }
    customElements.define('not-associated', NotFormAssociated);

    beforeEach(async () => {
      el = await fixture(html`<test-el></test-el>`);
      internals = el.internals;
    });

    afterEach(async () => fixtureCleanup(el));

    it('will attach an object to internals even if not form associated', async () => {
      const nonAssociated = await fixture(html`
        <not-associated></not-associated>`
      );
      expect(nonAssociated.internals).to.exist;
    });

    it('will return undefined from setFormValue', async () => {
      expect(internals.setFormValue('foo')).to.equal(undefined);
    });
  });

  describe('inside a custom element with a form', () => {
    let form, el, label, button, internals;

    beforeEach(async () => {
      form = await fixture(html`
        <form id="form">
          <label for="foo">Label text</label>
          <test-el name="foo" id="foo"></test-el>
          <button type="submit">Submit</button>
        </form>
      `);
      callCount = 0;
      label = form.querySelector('label');
      el = form.querySelector('test-el');
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

    it('will throw if setValidity is called without arguments', () => {
      expect(() => internals.setValidity()).to.throw();
    });

    it('will throw if setValidity is called with a flag and no validation message', () => {
      expect(() => {
        internals.setValidity({
          valueMissing: true
        });
      }).to.throw();
    });

    it('will return true for willValidate if the field can participate in the form', () => {
      expect(internals.willValidate).to.be.true;
    });

    it('will return false from willValidate if the field is disabled', async () => {
      el.disabled = true;
      await elementUpdated(el);
      expect(internals.willValidate).to.be.false;
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
      expect(callCount).to.equal(1);
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

    it('will associate the element\'s name with the form', () => {
      expect(form.foo).to.equal(el);
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
  });
});
