class ArrayUtilities {
  /**
   * Method used to flat an array (removes duplicates)
   * Example:
   * ['test', 'test', 'test1'] => ['test', 'test1']
   * @param list
   */
  flatArray(list) {
    return list.reduce((a, b) => {
      if (a.indexOf(b) < 0) a.push(b);

      return a;
    }, []);
  }

  /**
   * Method used to filter an array of objects by a given key (removes duplicates)
   * Example:
   * [{id: 12}, '{id: 12}, '{id: 13}'] => [{id: 12}', {id: 13}']
   * @param list
   * @param key
   */
  getUniqueArrayValues(list, key) {
    const uniq = {};

    return list.filter(obj => !uniq[obj[key]] && (uniq[obj[key]] = true));
  }

  /**
   * Returns a sorting function that recursively sorts array entries by given properties
   * @param sortByProps
   * @param index
   */
  static sortBy(sortByProps: string[], index = 0) {
    return (a, b) => {
      if (sortByProps.length <= index) {
        return 0;
      }

      const sortProp = sortByProps[index];

      if (a[sortProp] === b[sortProp]) {
        return ArrayUtilities.sortBy(sortByProps, index + 1)(a, b);
      }

      if (a[sortProp] < b[sortProp]) {
        return -1;
      }

      return 1;
    };
  }

  /**
   * Filters out null/undefined values
   */
  static definedValuesOnly = (array = []) => array.filter(val => val !== null && val !== undefined);

  static isNonEmptyArray = array => Array.isArray(array) && !!array.length;

  /**
   * Method returns the oldest date from a list of dates
   * @param dates
   */
  getOldestDate(dates) {
    return new Date(
      dates.reduce((currentValue, currentIndex) =>
        Date.parse(currentValue) < Date.parse(currentIndex) ? currentValue : currentIndex
      )
    );
  }

  /**
   * Sort key array by value
   *
   * @param array
   * @param needle
   */
  sortByKeyValue(array, needle) {
    return array.sort((a, b) => a[needle] - b[needle]);
  }
}

export default ArrayUtilities;
