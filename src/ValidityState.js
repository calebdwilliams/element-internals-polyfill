export class ValidityState {
  constructor() {
    this.badInput = false;
    this.customError = false;
    this.patternMismatch = false;
    this.rangeOverflow = false;
    this.rangeUnderflow = false;
    this.stepMismatch = false;
    this.tooLong = false;
    this.tooShort = false;
    this.typeMismatch = false;
    this.valid = true;
    this.valueMissing = false;

    Object.seal(this);
  }
};

export const isValid = validityState => {
  let valid = true;
  for (let key in validityState) {
    if (key !== 'valid' && validityState[key] !== false) {
      valid = false;
    }
  }
  return valid;
};
