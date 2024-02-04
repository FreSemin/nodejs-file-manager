import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { OperationFailedError } from '../utils/errors.util.js';
import { DIRECTORY_TYPE, FILE_TYPE } from '../constants/constants.js';

export async function getDirItems(dirPath) {
  try {
    const dirItems = await readdir(dirPath);

    return await Promise.allSettled(dirItems.map((item) => {
      return new Promise(async (resolve, reject) => {
        try {
          const itemStat = await stat(path.join(dirPath, item));
          const itemType = itemStat.isDirectory() ? DIRECTORY_TYPE : FILE_TYPE;

          resolve({ name: item, type: itemType });
        } catch {
          reject(null);
        }
      });
    }))
      .then((items) => {
        const directories = [];
        const files = [];

        const filteredItems = items.filter((item) => Boolean(item.value));

        filteredItems.forEach((item) => {
          if (item.value.type === DIRECTORY_TYPE) {
            directories.push(item.value);
          } else {
            files.push(item.value);
          }
        });

        return [
          ...directories.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1),
          ...files.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
        ];
      });
  } catch {
    throw new OperationFailedError();
  }
}