import path from 'node:path';
import { InvalidInputError, OperationFailedError } from './errors.util.js';
import { access } from 'node:fs/promises';

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

  return destinationPath;
}

export function parseLineArgs(inputStr) {
  if (!inputStr) {
    throw new InvalidInputError();
  }

  let normalizedStr = inputStr.trim().toLowerCase();

  const regexp = /([\w\.\\\/:-]+)|("[\w\s\.\\\/:-]+")/g;

  const args = Array.from(normalizedStr.match(regexp));

  return args.map((arg) => arg.replaceAll('\"', ''));
}

export async function getRelativeOrAbsoluteDestinationPath(currentDirPath, destinationPath) {
  try {
    const relativePath = path.normalize(path.join(currentDirPath, destinationPath));

    await access(relativePath);

    return relativePath;
  } catch {
    try {
      const absolutePath = path.normalize(path.join(destinationPath));

      await access(absolutePath);

      return absolutePath;
    } catch {
      throw new OperationFailedError();
    }
  }
}