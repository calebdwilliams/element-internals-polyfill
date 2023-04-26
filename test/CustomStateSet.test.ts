import '../dist/index.js';

import { fixture, html, expect, fixtureCleanup, aTimeout } from '@open-wc/testing';
import { ICustomElement } from '../dist';
import { CustomStateSet } from '../src/CustomStateSet';

class CustomElementStateInConstructor extends HTMLElement {
  internals = this.attachInternals();
  constructor() {
    super();

    this.internals.states.add('--foo');
  }
}

const tagName = 'custom-element-state-in-constructor'
customElements.define(tagName, CustomElementStateInConstructor);

describe('CustomStateSet polyfill', () => {
  let el: HTMLElement;
  let set: CustomStateSet;

  beforeEach(async () => {
    el = await fixture(html`<c-e></c-e>`);
    set = new CustomStateSet(el as ICustomElement);
  });

  afterEach(() => {
    fixtureCleanup();
  });

  it('will add attributes and parts', async () => {
    set.add('--foo');
    expect(el.hasAttribute('state--foo')).to.be.true;
    if (el.part) {
      expect(el.part.contains('state--foo')).to.be.true;
    }
  });

  it('will remove attributes and parts', async () => {
    set.add('--foo');
    expect(el.hasAttribute('state--foo')).to.be.true;
    if (el.part) {
      expect(el.part.contains('state--foo')).to.be.true;
    }

    set.delete('--foo');
    expect(el.hasAttribute('state--foo')).to.be.false;
    if (el.part) {
      expect(el.part.contains('state--foo')).to.be.false;
    }
  });

  it('will clear all attributes and parts', async () => {
    set.add('--foo');
    set.add('--bar');

    expect(el.hasAttribute('state--foo')).to.be.true;
    expect(el.hasAttribute('state--bar')).to.be.true;
    if (el.part) {
      expect(el.part.contains('state--foo')).to.be.true;
      expect(el.part.contains('state--bar')).to.be.true;
    }

    set.clear();
    expect(el.hasAttribute('state--foo')).to.be.false;
    expect(el.hasAttribute('state--bar')).to.be.false;
    if (el.part) {
      expect(el.part.contains('state--foo')).to.be.false;
      expect(el.part.contains('state--bar')).to.be.false;
    }
  });

  it('will use a timeout if a state is added in a constructor', async () => {
    let el;
    expect(() => {
      el = document.createElement(tagName);
    }).not.to.throw();

    if (window.CustomStateSet.isPolyfilled) {
      await aTimeout(100);
      expect(el.matches('[state--foo]')).to.be.true;
    } else {
      expect(el.matches(`:--foo`)).to.be.true;
    }
  });
});
