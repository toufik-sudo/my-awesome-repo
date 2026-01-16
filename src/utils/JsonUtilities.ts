class JsonUtilities {
  /**
   * Safely converts JSON string into object.
   *
   * @param value string to parse
   * @param defaultValue value to return in case parsing of given value fails
   */
  static safeParse(value: string, defaultValue = undefined) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return defaultValue;
    }
  }
}

export default JsonUtilities;
