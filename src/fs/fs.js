import { createReadStream, createWriteStream } from 'node:fs';
import {
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { OperationFailedError } from '../utils/errors.util.js';
import { DIRECTORY_TYPE, FILE_TYPE } from '../constants/constants.js';
import { pipeline } from 'node:stream/promises';
import { getUpDirPath } from '../utils/path.util.js';

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

export async function logFileContent(filePath) {
  await new Promise((resolve, reject) => {
    const fileContentStream = createReadStream(filePath, { encoding: 'utf-8' });

    fileContentStream.on('data', (chunk) => console.log(chunk));
    fileContentStream.on('end', resolve);
    fileContentStream.on('error', reject);
  });
}

export async function addNewFile(dirPath, fileName) {
  const filePath = path.join(dirPath, fileName);

  await writeFile(filePath, '', { flag: 'wx' });
}

export async function renameFile(filePath, newName) {
  const fileToRenameDirPath = getUpDirPath(filePath);

  await rename(filePath, path.join(fileToRenameDirPath, newName));
};

export function getFileName(filePath) {
  return path.basename(filePath);
}

export async function copyFile(filePath, destinationPath) {
  const fileName = await getFileName(filePath);

  await pipeline(
    createReadStream(filePath),
    createWriteStream(path.join(destinationPath, fileName))
  );
}

export async function removeFile(filePath) {
  await rm(filePath);
}