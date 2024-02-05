import os from 'node:os';

export function getUserHomeDir() {
  return os.homedir();
}

export function getEOL() {
  return os.EOL;
}
