import path from 'node:path';
import { PATH_IN, PATH_EMPTY } from '../constants/constants.js';

export function getPathDirName(dirPath) {
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
    upperPath = path.join('/');
    return path.normalize(upperPath);
  }

  return path.dirname(dirPath);
}