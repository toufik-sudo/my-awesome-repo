/**
 * Checks if file is of given type.
 * @param file
 * @param type
 */
export const isFileOfType = (file: File, type: string) => {
  const acceptedType = type.replace(/,/g, '|').replace(/\/\*/g, '/.*');
  const acceptedTypeRegex = new RegExp(`.?(${acceptedType})$`, 'i');

  return file.type && file.type.match(acceptedTypeRegex);
};

/**
 * Checks if file has any of the given extensions.
 * @param file
 * @param extensions
 */
export const hasExtension = (file: File, extensions: string[]) => {
  const extensionsRegex = new RegExp(`\\.(${extensions.join('|')})$`, 'i');

  return file.name.match(extensionsRegex);
};

/**
 * Converts bytes to megabytes.
 * @param bytes
 */
export const convertBytesToMb = (bytes: number): number => bytes / Math.pow(1024, 2);

/**
 * Converts megabytes to bytes.
 * @param bytes
 */
export const convertMbToBytes = (mbBytes: number): number => mbBytes * Math.pow(1024, 2);
