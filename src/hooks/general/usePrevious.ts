import { useRef, useEffect, MutableRefObject } from 'react';

/**
 * Given a reference to a prop/state value it offers the previous values
 * @param value
 */
function usePrevious<T>(value: T): T {
  const ref: MutableRefObject<T> = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;
