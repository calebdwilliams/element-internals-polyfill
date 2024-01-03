import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import '../dist/index.js';

class TestFileUpload extends HTMLElement {
  static formAssociated = true;
  internals = this.attachInternals();
}

customElements.define('test-file-upload', TestFileUpload);

async function createForm(): Promise<HTMLFormElement> {
  return await fixture<HTMLFormElement>(html`
    <form id="form">
      <test-file-upload name="foo" id="foo"></test-file-upload>
      <button type="submit">Submit</button>
    </form>`);
}

describe('setFormValue polyfill with File type', () => {
  let form, el, file;

  beforeEach(async () => {
    form = await createForm();
    el = form.querySelector('#foo') as TestFileUpload;
    file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
  });

  afterEach(async () => {
    await fixtureCleanup();
  });

  it('must submit a file', async () => {
    el.internals.setFormValue(file);

    const result = new FormData(form);
    expect(result.get('foo')).to.equal(file);
  });

  it('must submit multiple files through FormData', async () => {
    const formData = new FormData();
    formData.append('foo', file);
    formData.append('foo', file); // append the same file twice

    el.internals.setFormValue(formData);

    const result = new FormData(form);
    expect(result.getAll('foo')).to.deep.equal([file, file]);
  });
});
