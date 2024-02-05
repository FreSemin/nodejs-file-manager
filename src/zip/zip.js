import { createReadStream, createWriteStream } from 'node:fs';
import { getFileName } from '../fs/fs.js';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

export async function compress(fileForCompressPath, destinationPath) {
  const compressedFileName = getFileName(fileForCompressPath) + '.gz';

  const fileForCompressStream = createReadStream(fileForCompressPath);

  const compressStream = createBrotliCompress();

  const destinationStream = createWriteStream(path.join(destinationPath, compressedFileName));


  await pipeline(
    fileForCompressStream,
    compressStream,
    destinationStream
  );
};

export async function decompress(fileForDecompressPath, destinationPath) {
  let decompressedFileName = getFileName(fileForDecompressPath);

  if (decompressedFileName.endsWith('.gz')) {
    decompressedFileName = decompressedFileName.slice(0, -3);
  }

  const fileForDecompressStream = createReadStream(fileForDecompressPath);

  const decompressStream = createBrotliDecompress();

  const destinationStream = createWriteStream(path.join(destinationPath, decompressedFileName));


  await pipeline(
    fileForDecompressStream,
    decompressStream,
    destinationStream
  );
};