import path from 'node:path';
import { ROOT_DIR, PATH_IN, PATH_EMPTY } from '../constants/constants.js';
import { InvalidInputError } from './errors.util.js';

export function getUpDirPath(dirPath) {
  const parsedPath = path.parse(dirPath);

  const isRoot = (parsedPath.root === parsedPath.dir);

  const pathBase = parsedPath.base;

  let upperPath = '';

  // Would it work for MacOS and Linux?
  if ((isRoot) && pathBase !== PATH_EMPTY && pathBase !== PATH_IN) {
    upperPath = path.join(parsedPath.root);
    return path.normalize(upperPath);
  }

  if ((isRoot) && (pathBase === PATH_EMPTY || pathBase === PATH_IN)) {
    upperPath = path.join(ROOT_DIR);
    return path.normalize(upperPath);
  }

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