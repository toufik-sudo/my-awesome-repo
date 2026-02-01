// -----------------------------------------------------------------------------
// String Utilities
// Migrated from old_app/src/utils/StringUtilities.ts
// -----------------------------------------------------------------------------

import { COMMA_SEPARATOR, DOT_SEPARATOR } from '@/constants/general';

class StringUtilities {
  capitalize(string: string): string {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static capitalize(string: string): string {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  decimalReplace = (string: string): string => string.replace(COMMA_SEPARATOR, DOT_SEPARATOR);

  commaReplace = (string: string): string => string.replace(DOT_SEPARATOR, COMMA_SEPARATOR);

  static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  static equalsIgnoreCase(a: unknown, b: unknown): boolean {
    return StringUtilities.isString(a) && StringUtilities.isString(b) && a.toUpperCase() === b.toUpperCase();
  }
}

export default StringUtilities;
