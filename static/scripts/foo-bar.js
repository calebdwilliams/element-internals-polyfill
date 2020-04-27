export class FooBar extends HTMLElement {
  static get formAssociated() { return true; }
  static get observedAttributes() { return ['required', 'disabled']; }

  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
      delegatesFocus: true
    });
    this.internals_ = this.attachInternals();
    this._handleChanges = this._handleChanges.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
      <input type="text">
    `;
    this.input = this.shadowRoot.querySelector('input');

    this._init();
    this.required = this.hasAttribute('required');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const booleanAttributes = ['required', 'disabled'];
    if (booleanAttributes.includes(name)) {
      if (this.hasAttribute(name) && !this[name]) {
        this[name] = true;
      } else if (!this.hasAttribute(name) && this[name]) {
        this[name] = false;
      }
    } else if (newValue !== oldValue) {
      this[name] = newValue;
    }
  }

  formAssociatedCallback(form) {
    console.log({form})
  }

  formDisabledCallback(isDisabled) {
    console.log({isDisabled})
    this.input.disabled = isDisabled;
  }

  formResetCallback() {
    this.input.value = '';
    this.internals_.setFormValue('');
  }

  _init() {
    this.input.addEventListener('input', this._handleChanges);

    if (this.required) {
      this._handleRequired(this.value);
    }
  }

  _handleChanges(event) {
    const { value } = event.target;
    this.value = value;

    this._handleRequired(value);
  }

  _handleRequired(value) {
    if (!value) {
      this.internals_.setValidity({
        valueMissing: true
      }, 'This field is required');
    } else {
      this.internals_.setValidity({});
    }
  }

  get required() {
    return this.hasAttribute('required');
  }

  set required(required) {
    this.toggleAttribute('required', required);
    this.setAttribute('aria-required', !!required);
    this._handleRequired(!required);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.internals_.setFormValue(value);
    return true;
  }

  get checkValidity() {
    return () => this.internals_.checkValidity();
  }

  get validity() {
    return this.internals_.validity;
  }

  focus() {
    super.focus();
    this.input.focus();
  }
}

customElements.define('foo-bar', FooBar);
