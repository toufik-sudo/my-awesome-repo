import { useEffect, useRef } from 'react';

/**
 * Hook used to skip the first render
 *
 * @param fn
 * @param arr
 */
export const useUpdateEffect = (fn, arr) => {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    fn();
  }, [...arr]);
};
