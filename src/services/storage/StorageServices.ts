/**
 * Method used to get local storage
 *
 * @param key
 * @param defaultReturn
 */
export const getLocalStorage = <T = any>(key: string, defaultReturn: T | null = null): T | null => {
  try {
    const value: null | string = localStorage.getItem(key);
    if (!value) return defaultReturn;

    return JSON.parse(value) as T;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return defaultReturn;
  }
};

/**
 * Method used to set local storage
 *
 * @param key
 * @param value
 */
export const setLocalStorage = <T = any>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage:', e);
    throw new Error(e instanceof Error ? e.message : 'Failed to write to localStorage');
  }
};

/**
 * Method used to remove local storage item
 *
 * @param key
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage:', e);
    throw new Error(e instanceof Error ? e.message : 'Failed to remove from localStorage');
  }
};

/**
 * Method to clear all local storage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('Error clearing localStorage:', e);
    throw new Error(e instanceof Error ? e.message : 'Failed to clear localStorage');
  }
};

/**
 * Method to check if a key exists in local storage
 *
 * @param key
 */
export const hasLocalStorageItem = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (e) {
    console.error('Error checking localStorage:', e);
    return false;
  }
};
