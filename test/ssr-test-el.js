import { LitElement } from 'lit';

export class SsrTestEl extends LitElement {
  constructor() {
    super();
    this.internals = this.attachInternals();
    this.internals.role = 'widget';
  }
}

export const tagName = 'ssr-test-el'
customElements.define(tagName, SsrTestEl);
