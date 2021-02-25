import {
  aTimeout,
  expect,
  fixture,
  fixtureCleanup,
  html,
} from '@open-wc/testing';
import { spy } from 'sinon';
import '../dist/index.js';

describe('ElementInternals polyfill behavior', () => {
  describe('accessibility object model', () => {
    let el, internals;

    class AomTest extends HTMLElement {
      constructor() {
        super();
        this.internals = this.attachInternals();
        this.internals.ariaHidden = true;
      }
    }

    customElements.define('aom-test', AomTest);

    beforeEach(async () => {
      el = await fixture(html`<aom-test></aom-test>`);
      internals = el.internals;
    });

    afterEach(async () => {
      await fixtureCleanup(el);
    });

    it('will add aria attributes if polyfilled', () => {
      if (ElementInternals.isPolyfilled) {
        expect(el.getAttribute('aria-hidden')).to.equal('true');
      }
    });

    it('will modify aria attributes if polyfilled', () => {
      internals.ariaHidden = false;
      if (ElementInternals.isPolyfilled) {
        expect(el.getAttribute('aria-hidden')).to.equal('false');
      }
    });
  });

  describe('form associated behavior', () => {
    let form;
    let label;
    let el;
    let internals;

    class FormAssociated extends HTMLElement {
      static get formAssociated() {
        return true;
      }

      constructor() {
        super();
        this.internals = this.attachInternals();
      }

      connectedCallback() {
        this.tabIndex = -1;
        const root = this.attachShadow({ mode: 'open' });
        root.innerHTML = `<input />`;
        this.input = root.querySelector('input');
      }
    }

    customElements.define('form-associated', FormAssociated);

    beforeEach(async () => {
      form = await fixture(html`<form>
        <label for="demo">Demo text</label>
        <form-associated id="demo"></form-associated>
      </form>`);
      label = form.querySelector('label');
      el = form.querySelector('form-associated');
      internals = el.internals;
    });

    afterEach(async () => await fixtureCleanup(form));

    it('will set the aria atttributes on label', async () => {
      expect(internals.labels.length).to.equal(1);
    });
  });
});
