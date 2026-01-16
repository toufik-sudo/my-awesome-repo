import { COMMA_SEPARATOR, DOT_SEPARATOR } from 'constants/general';

/**
 * String utilities class used for utilities methods
 */
class StringUtilities {
  capitalize(string) {
    if (typeof string !== 'string') return '';

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  decimalReplace = string => string.replace(COMMA_SEPARATOR, DOT_SEPARATOR);

  commaReplace = string => string.replace(DOT_SEPARATOR, COMMA_SEPARATOR);

  static isString(value: any) {
    return typeof value === 'string';
  }

  static equalsIgnoreCase(a, b) {
    return StringUtilities.isString(a) && StringUtilities.isString(b) && a.toUpperCase() === b.toUpperCase();
  }
}

export default StringUtilities;
