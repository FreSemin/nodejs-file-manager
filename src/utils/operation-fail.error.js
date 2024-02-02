import { ERROR_OPERATION_FAIL_TEXT } from '../constants/constants.js';

export default class OperationFailed extends Error {
  constructor(message = ERROR_OPERATION_FAIL_TEXT) {
    super(message);
    this.name = this.constructor.name;
  }
}