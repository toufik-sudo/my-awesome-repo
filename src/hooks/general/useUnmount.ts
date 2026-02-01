// -----------------------------------------------------------------------------
// useUnmount Hook
// Runs cleanup function on component unmount
// -----------------------------------------------------------------------------

import { useEffect, useRef } from 'react';

/**
 * Hook that runs a cleanup function when the component unmounts
 * @param fn - Cleanup function to run on unmount
 */
export const useUnmount = (fn: () => void) => {
  const fnRef = useRef(fn);
  
  // Update ref to always have the latest function
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
};

export default useUnmount;
