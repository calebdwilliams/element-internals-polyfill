import '../dist/index.js';

import { cleanupFixtures, ssrFixture } from '@lit-labs/testing/fixtures.js';
import { expect } from '@open-wc/testing';
import { LitElement, html } from 'lit';

class SsrTestEl extends LitElement {
  internals = this.attachInternals();
  constructor() {
    super();
    this.internals.role = 'widget';
  }
}

customElements.define('ssr-test-el', SsrTestEl);

describe('The polyfill on the server', () => {
  afterEach(cleanupFixtures);

  it('should not throw', async () => {
    const el = await ssrFixture<SsrTestEl>(html`<ssr-test-el></ssr-test-el>`, {
      hydrate: false,
      modules: ['../dist/index.js', './ssr-test-el.js']
    });

    expect(el.internals).to.exist;
    if (ElementInternals['isPolyfilled'] === true) {
      expect(el.getAttribute('role')).to.equal('widget');
    }
  });
});
