const sheet = new CSSStyleSheet();
sheet.replace(`:host {
  display: block;
  height: 30px;
  background: green;
}
:host(:invalid), :host([internals-invalid]) {
  background: red;
}
:host(:valid) {
  background: tomato;
}`);

const template = document.createElement('template');
template.innerHTML = '<span class="count"></span> invalid events';

class MyComponent extends HTMLElement {
  static get formAssociated() { return true; }

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.count = 0;
    this.addEventListener('invalid', () => this.render(1));
    const root = this.attachShadow({mode: 'open'});
    root.adoptedStyleSheets = [sheet];
    root.append(template.content.cloneNode(true));
    this._count = root.querySelector('.count');
  }

  connectedCallback() {
    this.internals.setValidity({ valueMissing: true }, 'aaaa');
    this.render(0);
  }

  render(increment) {
    this.count += increment;
    this._count.innerText = this.count;
  }
}

customElements.define('my-component', MyComponent);

const form = document.querySelector('form');

// const submit = document.querySelector('#submit').addEventListener('click', (e)=>{
//   form.submit();
// });
form.addEventListener('invalid', console.log);
const reportValidity = document.querySelector('#reportValidity').addEventListener('click', (e)=>{
  alert(form.reportValidity());
});
const checkValidity = document.querySelector('#checkValidity').addEventListener('click', (e)=>{
  alert(form.checkValidity());
});
