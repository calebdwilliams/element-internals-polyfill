describe('The ElementInternals polyfill outside of the proper context', () => {
  it('Will throw if called directly', () => {
    expect(() => new ElementInternals()).toThrow();
  });

  it('Will throw if called by a non custom element', () => {
    expect(() => document.createElement.div.attachInternals()).toThrow();
  });
});

