import { InvalidInputError } from './errors.util.js';

export function parseArgs() {
  const args = process.argv.splice(2);
  const argsMap = new Map();

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');

      argsMap.set(key.slice(2), value);
    }
  });

  return argsMap;
}

export function validateArgs(args) {
  args.forEach(arg => {
    if (!arg) {
      throw new InvalidInputError();
    }
  });
}