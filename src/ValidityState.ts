import { setFormValidity } from './utils.js';

/** Emulate the browser's default ValidityState object */
export class ValidityState implements ValidityState {
  badInput = false;
  customError = false;
  patternMismatch = false;
  rangeOverflow = false;
  rangeUnderflow = false;
  stepMismatch = false;
  tooLong = false;
  tooShort = false;
  typeMismatch = false;
  valid = true;
  valueMissing = false;

  constructor() {
    Object.seal(this);
  }
}

/**
 * Reset a ValidityState object back to valid
 * @param {ValidityState} validityObject - The object to modify
 * @return {ValidityState} - The modified ValidityStateObject
 */
export const setValid = (validityObject: ValidityState): ValidityState => {
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

/**
 * Reconcile a ValidityState object with a new state object
 * @param {ValidityState} - The base object to reconcile with new state
 * @param {Object} - A partial ValidityState object to override the original
 * @return {ValidityState} - The updated ValidityState object
 */
export const reconcileValidity = (validityObject: ValidityState, newState: Partial<ValidityState>, form: HTMLFormElement): ValidityState => {
  validityObject.valid = isValid(newState);
  Object.keys(newState).forEach(key => validityObject[key] = newState[key]);
  if (form) {
    setFormValidity(form);
  }
  return validityObject;
};

/**
 * Check if a partial ValidityState object should be valid
 * @param {Object} - A partial ValidityState object
 * @return {Boolean} - Should the new object be valid
 */
export const isValid = (validityState: Partial<ValidityState>): boolean => {
  let valid = true;
  for (let key in validityState) {
    if (key !== 'valid' && (validityState[key] !== false && validityState[key] !== undefined)) {
      valid = false;
    }
  }
  return valid;
};
