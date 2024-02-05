import os from 'node:os';
import { InvalidInputError } from '../utils/errors.util.js';

export function getUserHomeDir() {
  return os.homedir();
}

export function getUserInfo() {
  return os.userInfo();
}

export function getCpus() {

  return os.cpus().map((cpu) => {
    return {
      model: cpu.model,
      speed: cpu.speed / 1000 + ' GHz'
    };
  });
}

export function getArch() {
  return os.arch();
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
    case '--username': {
      console.log(getUserInfo().username);

      break;
    }
    case '--cpus': {
      console.table(getCpus());

      break;
    }
    case '--architecture': {
      console.log(getArch());

      break;
    }


    default: {
      throw new InvalidInputError();
    }
  }
}