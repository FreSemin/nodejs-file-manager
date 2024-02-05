import os from 'node:os';
import { InvalidInputError } from '../utils/errors.util.js';

export function getUserHomeDir() {
  return os.homedir();
}

export function getEOL() {
  return os.EOL;
}

export async function performOSOperation(argument) {
  const normalizedArg = argument.toLowerCase();

  switch (normalizedArg) {
    case '--eol': {
      const eol = getEOL();

      console.log(JSON.stringify(eol));

      break;
    }
    case '--homedir': {
      console.log(getUserHomeDir());

      break;
    }


    default: {
      throw new InvalidInputError();
    }
  }
}