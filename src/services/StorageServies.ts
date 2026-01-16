/**
 * Method used to get local storage
 *
 * @param key
 * @param defaultReturn
 */
export const getLocalStorage = (key: string, defaultReturn: any = null) => {
  const value: null | string = localStorage.getItem(key);
  if (!value) return defaultReturn;

  return JSON.parse(value);
};

/**
 * Method used to set local storage
 *
 * @param key
 * @param value
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Method used to remove local storage item
 *
 * @param key
 */
export const removeLocalStorage = key => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    throw new Error(e);
  }
};
