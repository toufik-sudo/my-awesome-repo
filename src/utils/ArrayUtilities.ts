// -----------------------------------------------------------------------------
// Array Utilities
// Migrated from old_app/src/utils/ArrayUtilities.ts
// -----------------------------------------------------------------------------

class ArrayUtilities {
  /**
   * Method used to flat an array (removes duplicates)
   * Example: ['test', 'test', 'test1'] => ['test', 'test1']
   */
  flatArray<T>(list: T[]): T[] {
    return list.reduce((acc: T[], item: T) => {
      if (acc.indexOf(item) < 0) acc.push(item);
      return acc;
    }, []);
  }

  /**
   * Static version of flatArray
   */
  static flatArray<T>(list: T[]): T[] {
    return list.reduce((acc: T[], item: T) => {
      if (acc.indexOf(item) < 0) acc.push(item);
      return acc;
    }, []);
  }

  /**
   * Method used to filter an array of objects by a given key (removes duplicates)
   * Example: [{id: 12}, {id: 12}, {id: 13}] => [{id: 12}, {id: 13}]
   */
  getUniqueArrayValues<T extends Record<string, unknown>>(list: T[], key: string): T[] {
    const uniq: Record<string, boolean> = {};
    return list.filter(obj => !uniq[obj[key] as string] && (uniq[obj[key] as string] = true));
  }

  /**
   * Returns a sorting function that recursively sorts array entries by given properties
   */
  static sortBy<T extends Record<string, unknown>>(sortByProps: string[], index = 0) {
    return (a: T, b: T): number => {
      if (sortByProps.length <= index) {
        return 0;
      }

      const sortProp = sortByProps[index];

      if (a[sortProp] === b[sortProp]) {
        return ArrayUtilities.sortBy<T>(sortByProps, index + 1)(a, b);
      }

      if ((a[sortProp] as string | number) < (b[sortProp] as string | number)) {
        return -1;
      }

      return 1;
    };
  }

  /**
   * Filters out null/undefined values
   */
  static definedValuesOnly = <T>(array: (T | null | undefined)[] = []): T[] => 
    array.filter((val): val is T => val !== null && val !== undefined);

  static isNonEmptyArray = <T>(array: unknown): array is T[] => 
    Array.isArray(array) && array.length > 0;

  /**
   * Method returns the oldest date from a list of dates
   */
  getOldestDate(dates: string[]): Date {
    return new Date(
      dates.reduce((currentValue, currentIndex) =>
        Date.parse(currentValue) < Date.parse(currentIndex) ? currentValue : currentIndex
      )
    );
  }

  /**
   * Sort key array by value
   */
  sortByKeyValue<T extends Record<string, number>>(array: T[], needle: keyof T): T[] {
    return array.sort((a, b) => a[needle] - b[needle]);
  }
}

export default ArrayUtilities;
