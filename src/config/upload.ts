import crypto from 'crypto';
import multer from 'multer';
import { resolve } from 'path';

interface IReturn {
  storage: multer.StorageEngine;
}

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const filehash = crypto.randomBytes(16).toString('hex');
      const filename = `${filehash}-${file.originalname}`;
      return callback(null, filename);
    },
  }),
};
