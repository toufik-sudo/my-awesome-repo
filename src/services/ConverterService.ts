/**
 * Service used to convert bytes to kb,mb etc
 * @param bytes
 */
export const byteConverter = bytes => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0,
    n = parseInt(bytes, 10) || 0;

  while (n >= 1024 && ++index) {
    n = n / 1024;
  }
  return n.toFixed(n < 10 && index > 0 ? 1 : 0) + ' ' + units[index];
};
