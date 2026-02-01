class JsonUtilities {
  /**
   * Safely converts JSON string into object.
   *
   * @param value string to parse
   * @param defaultValue value to return in case parsing of given value fails
   */
  static safeParse<T = any>(value: string, defaultValue: T | undefined = undefined): T | undefined {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      return defaultValue;
    }
  }

  /**
   * Safely stringifies an object to JSON.
   *
   * @param value object to stringify
   * @param defaultValue value to return in case stringification fails
   */
  static safeStringify(value: any, defaultValue: string = ''): string {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return defaultValue;
    }
  }

  /**
   * Deep clones an object using JSON serialization.
   * Note: This will not preserve functions, undefined, or circular references.
   *
   * @param value object to clone
   */
  static deepClone<T>(value: T): T | null {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (e) {
      return null;
    }
  }

  /**
   * Checks if a string is valid JSON.
   *
   * @param value string to check
   */
  static isValidJson(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default JsonUtilities;
