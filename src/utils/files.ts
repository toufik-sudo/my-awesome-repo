/**
 * File Utilities
 * Migrated from old_app/src/utils/files.ts
 */

/**
 * Checks if file is of given type.
 * @param file - The file to check
 * @param type - The accepted type pattern (e.g., "image/*")
 */
export const isFileOfType = (file: File, type: string | string[]): boolean => {
  const typeStr = Array.isArray(type) ? type.join(',') : type;
  const acceptedType = typeStr.replace(/,/g, '|').replace(/\/\*/g, '/.*');
  const acceptedTypeRegex = new RegExp(`.?(${acceptedType})$`, 'i');

  return !!(file.type && file.type.match(acceptedTypeRegex));
};

/**
 * Checks if file has any of the given extensions.
 * @param file - The file to check
 * @param extensions - Array of allowed extensions
 */
export const hasExtension = (file: File, extensions: string[]): boolean => {
  const extensionsRegex = new RegExp(`\\.(${extensions.join('|')})$`, 'i');

  return !!file.name.match(extensionsRegex);
};

/**
 * Converts bytes to megabytes.
 * @param bytes - Number of bytes
 */
export const convertBytesToMb = (bytes: number): number => bytes / Math.pow(1024, 2);

/**
 * Converts megabytes to bytes.
 * @param mbBytes - Number of megabytes
 */
export const convertMbToBytes = (mbBytes: number): number => mbBytes * Math.pow(1024, 2);

/**
 * Gets file extension from filename
 * @param filename - The filename to extract extension from
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Checks if a file is an image based on its type
 * @param file - The file to check
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Checks if a file is a video based on its type
 * @param file - The file to check
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};
