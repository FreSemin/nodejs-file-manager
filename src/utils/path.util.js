import path from 'node:path';

export function getPathDirName(dirPath) {
  const parsedPath = path.parse(dirPath);

  const isRoot = (parsedPath.root === parsedPath.dir);

  const pathBase = parsedPath.base;

  let upperPath = '';

  // Would it work for MacOS and Linux?
  if ((isRoot) && pathBase !== '.') {
    upperPath = path.join(parsedPath.root);
    return path.normalize(upperPath);
  }

  if ((isRoot) && (pathBase === '' || pathBase === '.')) {
    upperPath = path.join('/');
    return path.normalize(upperPath);
  }

  return path.dirname(dirPath);
}