import { expect, fixture, html } from '@open-wc/testing';
import '../dist/index.js';

class TestInput extends HTMLElement {
  static formAssociated = true;
  internals = this.attachInternals();
}

customElements.define('test-input', TestInput);

class TestDummy extends HTMLElement {
}

customElements.define('test-dummy', TestDummy);

async function createForm(): Promise<HTMLFormElement> {
  return await fixture<HTMLFormElement>(html`
    <form id="form">
      <input type="text" name="foo" id="foo"/>
      <test-input name="first" id="ti1"></test-input>
      <test-dummy name="avoid-me" id="td"></test-dummy>
      <test-input name="second" id="ti2"></test-input>
      <test-input name="third" id="ti3"></test-input>
      <button type="submit">Submit</button>
    </form>`);
}

it('must contains the custom elements associated to the current form, in the correct order', async () => {
  const form = await createForm();
  expect(form.elements).to.have.length(5);

  expect(form.elements[0]).to.be.an.instanceof(HTMLInputElement);
  expect(form.elements[1]).to.be.an.instanceof(TestInput);
  expect(form.elements[2]).to.be.an.instanceof(TestInput);
  expect(form.elements[3]).to.be.an.instanceof(TestInput);
  expect(form.elements[4]).to.be.an.instanceof(HTMLButtonElement);

  expect(form.elements[0].id).to.equal('foo');
  expect(form.elements[1].id).to.equal('ti1');
  expect(form.elements[2].id).to.equal('ti2');
  expect(form.elements[3].id).to.equal('ti3');

  expect(form.elements.namedItem('foo')).to.be.an.instanceof(HTMLInputElement);
  expect(form.elements.namedItem('first')).to.be.an.instanceof(TestInput);
  expect(form.elements.namedItem('avoid-me')).to.be.null;
  expect(form.elements.namedItem('second')).to.be.an.instanceof(TestInput);
  expect(form.elements.namedItem('third')).to.be.an.instanceof(TestInput);
});
