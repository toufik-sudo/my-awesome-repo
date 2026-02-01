// -----------------------------------------------------------------------------
// useUpdateEffect Hook
// useEffect that skips the initial render
// -----------------------------------------------------------------------------

import { useEffect, useRef, DependencyList, EffectCallback } from 'react';

/**
 * A useEffect hook that only runs on updates (skips initial mount)
 * @param effect - Effect callback
 * @param deps - Dependency array
 */
export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useUpdateEffect;
