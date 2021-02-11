import 'https://cdn.skypack.dev/construct-style-sheets-polyfill';
import './x-array.js';
import './address.js';

const form = document.getElementById('form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formValue = {};

  formData.forEach((value, name) => {
    formValue[name] = value;
  });

  console.log(formValue);
});

const div = document.createElement('div');
document.body.append(div);
const testRoot = div.attachShadow({ mode: 'open' });
const shadowForm = document.createElement('form');
shadowForm.id = 'shadowTestForm';
const fooBar = document.createElement('foo-bar');
fooBar.required = true;
testRoot.append(shadowForm);
testRoot.append(fooBar);
setTimeout(() => {
  console.log('start');
  shadowForm.append(fooBar);
  console.log('finish', fooBar);
}, 2000);
