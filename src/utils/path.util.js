import path from 'node:path';

export function getPathDirName(dirPath) {
  const parsedPath = path.parse(dirPath);

  let upperPath = '';

  if ((parsedPath.root === parsedPath.dir) && parsedPath.base !== '') {
    upperPath = path.join(parsedPath.root);
    return path.normalize(upperPath);
  }

  // Would it work on MacOS and Linux?
  if ((parsedPath.root === parsedPath.dir) && parsedPath.base === '') {
    upperPath = path.join('/');
    return path.normalize(upperPath);
  }

  return path.dirname(dirPath);
}