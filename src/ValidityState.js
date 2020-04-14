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

export const setValid = validityObject => {
  validityObject.badInput = false;
  validityObject.customError = false;
  validityObject.patternMismatch = false;
  validityObject.rangeOverflow = false;
  validityObject.rangeUnderflow = false;
  validityObject.stepMismatch = false;
  validityObject.tooLong = false;
  validityObject.tooShort = false;
  validityObject.typeMismatch = false;
  validityObject.valid = true;
  validityObject.valueMissing = false;
  return validityObject;
};

export const reconcileValidty = (validityObject, newState) => {
  validityObject.valid = isValid(newState);
  Object.keys(newState).forEach(key => validityObject[key] = newState[key]);
  return validityObject;
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
