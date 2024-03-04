import { ERROR_OPERATION_FAIL_TEXT, ERROR_INVALID_INPUT_TEXT } from '../constants/constants.js';

export class OperationFailedError extends Error {
  constructor(message = ERROR_OPERATION_FAIL_TEXT) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidInputError extends Error {
  constructor(message = ERROR_INVALID_INPUT_TEXT) {
    super(message);
    this.name = this.constructor.name;
  }
}