import {
  aTimeout,
  expect,
  fixture,
  fixtureCleanup,
  html,
} from '@open-wc/testing';
import '../dist/index.js';

let formDisabledCallbackCalled = false;
class FieldsetTestElement extends HTMLElement {
  static formAssociated = true;
  internals = this.attachInternals();

  formDisabledCallback() {
    formDisabledCallbackCalled = true;
  }
}

customElements.define('fieldset-test-element', FieldsetTestElement);
interface FieldsetTestElementFixtureConfig {
  disabled?: boolean;
}

async function createFieldset({ disabled }: FieldsetTestElementFixtureConfig = {}): Promise<HTMLFieldSetElement> {
  return await fixture<HTMLFieldSetElement>(html`<fieldset ?disabled="${disabled}">
    <legend>Demo</legend>
    <fieldset-test-element name="foo"></fieldset-test-element>
  </fieldset>`);
}

describe('Internals behaviors with fieldset', () => {
  afterEach(fixtureCleanup);
  afterEach(() => {
    formDisabledCallbackCalled = false;
  });

  it('will trigger the formDisabledCallback of a nested component when the fieldset is disabled', async () => {
    const fieldset = await createFieldset();
    expect(formDisabledCallbackCalled).to.be.false;
    fieldset.disabled = true;
    await aTimeout(0);
    expect(formDisabledCallbackCalled).to.be.true;
  });

  it('will trigger the formDisabledCallback of a nested component when the fieldset is disabled on first render', async () => {
    await createFieldset({
      disabled: true
    });
    expect(formDisabledCallbackCalled).to.be.true;
  });
});
