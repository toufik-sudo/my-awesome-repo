import { useEffect } from 'react';

/**
 * The provided function is run on unmount hook lifecycle if the option condition is true
 *
 * @param unmountFunction
 * @param deps
 * @param shouldRun
 */
const useUnmount = (unmountFunction, deps = [], shouldRun = true) => {
  useEffect(() => {
    if (shouldRun) {
      return unmountFunction;
    }
  }, [...deps]);
};

export default useUnmount;
