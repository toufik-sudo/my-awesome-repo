// -----------------------------------------------------------------------------
// usePrevious Hook
// Returns the previous value of a prop/state
// -----------------------------------------------------------------------------

import { useRef, useEffect, MutableRefObject } from 'react';

/**
 * Given a reference to a prop/state value it offers the previous values
 * @param value - Current value to track
 */
function usePrevious<T>(value: T): T | undefined {
  const ref: MutableRefObject<T | undefined> = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

export default usePrevious;
export { usePrevious };
