class XArray extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  internals = this.attachInternals();

  connectedCallback() {
    console.log(this.internals);
    this.internals.setFormValue({a:1,b:2});

    console.log(this.getAttribute('name'),
      new FormData(this.internals.form)
        .get(this.getAttribute('name'))
    )
  }
}

customElements.define('x-array', XArray);
