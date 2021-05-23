import { fixture, html, expect, fixtureCleanup } from '@open-wc/testing';
import { ICustomElement } from '../dist';
import { CustomStateSet } from '../src/CustomStateSet';

describe('CustomStateSet polyfill', () => {
  let el: HTMLElement;
  let set: CustomStateSet;

  beforeEach(async () => {
    el = await fixture(html`<div></div>`);
    set = new CustomStateSet(el as ICustomElement);
  });

  afterEach(() => {
    fixtureCleanup();
  });

  describe('it will add attributes', async () => {
    set.add('--foo');
    expect(el.hasAttribute('state--foo')).to.be.true;
  });

  describe('it will remove attributes', async () => {
    set.add('--foo');
    expect(el.hasAttribute('state--foo')).to.be.true;

    set.delete('--foo');
    expect(el.hasAttribute('state--foo')).to.be.false;
  });

  describe('it will clear all attributes', async () => {
    set.add('--foo');
    set.add('--bar');

    expect(el.hasAttribute('state--foo')).to.be.true;
    expect(el.hasAttribute('state--bar')).to.be.true;

    set.clear();
    expect(el.hasAttribute('state--foo')).to.be.false;
    expect(el.hasAttribute('state--bar')).to.be.false;
  });
});
