/**
 * General Utilities
 * Migrated from old_app/src/utils/general.tsx
 */

import Cookies from 'js-cookie';
import { EMAIL_REGEXP } from '@/constants/validation';

// Cookie Constants
export const USER_DETAILS_COOKIE = 'userDetails';
export const USER_STEP_COOKIE = 'userStep';

/**
 * Empty function (no-op)
 */
export const emptyFn = (): null => null;

/**
 * Get the first value from an object
 * @param v - Object to get value from
 */
export const getObjectValue = <T>(v: Record<string, T>): T => v[Object.keys(v)[0]];

/**
 * Get the first key from an object
 * @param v - Object to get key from
 */
export const getObjectKey = (v: Record<string, any>): string => Object.keys(v)[0];

/**
 * Get current seconds
 */
export const getSeconds = (): number => new Date().getSeconds();

/**
 * Convert object to array of values from a nested key
 * @param object - Object to convert
 * @param secondKey - Nested key to extract
 */
export const objectToArrayKey = <T, K extends string>(object: Array<Record<K, T>> | Record<string, Record<K, T>>, secondKey: K): T[] => {
  if (Array.isArray(object)) {
    return object.map(item => item[secondKey]);
  }
  return Object.keys(object).map(key => (object as Record<string, Record<K, T>>)[key][secondKey]);
};

/**
 * Check if the current device is mobile
 */
export const isMobile = (): boolean => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

/**
 * Convert ASCII code to string character
 * @param value - ASCII offset (0 = A, 1 = B, etc.)
 */
export const convertAsciiToString = (value: number): string => String.fromCharCode(value + 65);

/**
 * Get object key by its value
 * @param object - Object to search
 * @param value - Value to find
 */
export const getKeyByValue = <T>(object: Record<string, T>, value: T): string | undefined =>
  Object.keys(object).find(key => object[key] === value);

/**
 * Convert string with comma to float number
 * @param value - String or number to convert (e.g., "1,5")
 */
export const convertToFloatNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseFloat(String(value).replace(',', '.'));
};

/**
 * Check if a value is an object
 * @param value - Value to check
 */
export const isObject = (value: any): boolean => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
};

/**
 * Check if value is not null or undefined
 * @param value - Value to check
 */
export const hasNonNullValue = (value: any): boolean => value !== undefined && value !== null;

/**
 * Get a specific field from the user cookie
 * @param name - Field name to get
 */
export const getUserCookie = (name: string): any => {
  const userCookie = Cookies.get(USER_DETAILS_COOKIE);
  if (userCookie) {
    try {
      return JSON.parse(userCookie)[name];
    } catch {
      return undefined;
    }
  }
  return undefined;
};

/**
 * Convert string to camelCase
 * @param str - String to convert
 */
export const toCamelCase = (str: string): string => {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

/**
 * Convert File to base64 format
 * @param file - File to convert
 * @param callback - Callback with result and error
 */
export const convertToBase64 = (
  file: File,
  callback: (result: string | ArrayBuffer | null, error: DOMException | null) => void
): void => {
  try {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      callback(e.target?.result ?? null, e.target?.error ?? null);
    };
    reader.readAsDataURL(file);
  } catch (e) {
    throw new Error(String(e));
  }
};

// Base64 decoder constants
const BASE_64_DECODER = {
  NAME: ';base64,',
  START_POS: 5,
  END_POS: 8
};

/**
 * Convert base64 string to Blob
 * @param str - Base64 string to convert
 */
export const base64ImageToBlob = (str: string): Blob => {
  const pos = str.indexOf(BASE_64_DECODER.NAME);
  const type = str.substring(BASE_64_DECODER.START_POS, pos);
  const b64 = str.substr(pos + BASE_64_DECODER.END_POS);
  const imageContent = atob(b64);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);

  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  return new Blob([buffer], { type });
};

/**
 * Disable form submit on Enter key
 * @param e - Keyboard event
 */
export const disableSubmitOnEnter = (e: React.KeyboardEvent): void => {
  if (e.key === 'Enter') e.preventDefault();
};

/**
 * Check if value has valid email format
 * @param value - String to validate
 */
export const hasValidEmailFormat = (value: string): boolean => {
  return EMAIL_REGEXP.test(value);
};

/**
 * Calculate percentage
 * @param percentFor - Numerator value
 * @param percentOf - Denominator value
 */
export const getPercentNumber = (percentFor: number, percentOf: number): number => {
  return Math.floor((percentFor * 100) / percentOf);
};

/**
 * Format number with space separators for thousands
 * @param value - Number to format
 */
export const numberWithSpaces = (value: number | string): string =>
  value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';

/**
 * Format number with dot separators for thousands
 * @param value - Number to format
 */
export const numberWithDots = (value: number | string): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Format number for locale (French)
 * @param number - Number to format
 */
export const formatNumberLocale = (number: number | string): string | null => {
  const locale = 'fr-FR';
  const castedValue = Number(number);
  return castedValue ? castedValue.toLocaleString(locale) : null;
};

/**
 * Open URL in new browser tab
 * @param event - Click event
 * @param url - URL to open
 */
export const openTab = (event: React.MouseEvent, url: string): void => {
  event.preventDefault();
  window.open(url, '_blank');
  window.focus();
};

/**
 * Key names constants
 */
export const KEY_NAMES = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  BACKSPACE: 'Backspace'
};

export const BACKSPACE = 'Backspace';
export const NON_NUMERIC_VALUES = ['+', '-', 'e', 'E', '.'];

/**
 * Block number invalid characters in input
 * @param event - Keyboard event
 */
export const blockNumberInvalidCharacters = (event: React.KeyboardEvent): void => {
  if (event.key === BACKSPACE) return;
  if (!event.key.match(/^[0-9]+$/)) event.preventDefault();
  NON_NUMERIC_VALUES.forEach(value => {
    if (event.key === value) event.preventDefault();
  });
};
