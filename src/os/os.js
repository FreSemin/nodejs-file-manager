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

    default: {
      throw new InvalidInputError();
    }
  }
}