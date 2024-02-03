import path from 'node:path';
import { ROOT_DIR, PATH_IN, PATH_EMPTY } from '../constants/constants.js';
import { InvalidInputError } from './errors.util.js';

export function getUpDirPath(dirPath) {
  return path.dirname(dirPath);
}

export function fixDestinationPathWindows(destinationPath) {
  if (
    destinationPath.endsWith(':..')
    || destinationPath.endsWith(':.')
    || destinationPath.endsWith(':.\\')
    || destinationPath.endsWith(':..\\')
  ) {
    return destinationPath.replace(/:\.\.?\\?$/gm, ':\\');
  }

  // if ..\ 
  // then replace

  return destinationPath;
}

export function parseLineArgs(inputStr) {
  if (!inputStr) {
    throw new InvalidInputError();
  }

  let normalizedStr = inputStr.trim().toLowerCase();

  const regexp = /([\w\.\\/:]+)|("[\w\s\.\\/:]+")/g;

  const args = Array.from(normalizedStr.match(regexp));

  return args.map((arg) => arg.replaceAll('\"', ''));
}