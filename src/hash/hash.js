import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';

export async function calcHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');

    const fileStream = createReadStream(filePath);

    fileStream.on('data', (chunk) => {
      hash.update(chunk);
    });
    fileStream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}