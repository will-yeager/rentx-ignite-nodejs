import fs from 'fs';

export const deleteFile = async (filename: string): Promise<void> => {
  try {
    await fs.promises.stat(filename);
  } catch {
    return Promise.resolve();
  }

  return fs.promises.unlink(filename);
};
