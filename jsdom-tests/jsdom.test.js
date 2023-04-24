import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

const polyfillContents = readFileSync('./dist/index.js', 'utf-8');

function test(title, condition) {
  if (!condition) {
    throw new Error(`${title} failed with error ${error}`);
  } else {
    console.log(`${title} passed in JSDOM`);
  }
}

JSDOM.fromFile('./jsdom-tests/index.html', {
  runScripts: 'dangerously'
}).then(async ({ window }) => {
  const document = window._document;

  const polyfill = document.createElement('script');
  polyfill.textContent = polyfillContents;

  document.body.append(polyfill);

  const form = document.createElement('form');
  const testElement = document.createElement('test-element');
  testElement.setAttribute('name', 'test');

  form.append(testElement);
  document.body.append(form);

  setImmediate(async () => {
    test('ElementInternals is defined on the window', typeof window.ElementInternals !== 'undefined');
    test('Polyfilled ElementInternals.prototype.form is working', testElement.internals.form === form);
    test('Polyfilled form attachment is working', new window.FormData(form).get('test') === 'foo');
  });
});
