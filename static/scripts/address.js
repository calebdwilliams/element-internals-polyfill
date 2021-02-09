const addressSheet = new CSSStyleSheet();
addressSheet.replace('input { display: block; } fieldset { display: flex; flex-flow: column; gap: 16px; border: 1px solid #ccc}');

class Address extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  internals = this.attachInternals();

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [addressSheet];
    const form = document.createElement('form');
    form.innerHTML = `
    <fieldset>
      <legend>Address</legend>
      <input name="line1" value="1600 Pennsylvania Ave"/>
      <input name="line2"/>
      <input name="city" value="Washington"/>
      <input name="state" value="District of Columbia"/>
      <button type="submit">Test</button>
      <button type="button">Other</button>
    </fieldset>`;
    root.append(form);

    // this.log();
    form.addEventListener('submit', this.log.bind(this));

    root.querySelector('[type="button"]')
      .addEventListener('click', this._other.bind(this));
  }

  _other() {
    this.shadowRoot.querySelector('input').remove();
  }

  log(event) {
    if (event) {
      event.preventDefault();
    }
    const internalFormData = new FormData(
      this.shadowRoot.querySelector('form')
    );
    this.internals.setFormValue(
      internalFormData
    );

    const allData = new FormData(this.internals.form);

    for (let [key, value] of allData.entries()) {
      console.log({ [key]: value });
    }
  }
}

customElements.define('x-address', Address);
