// -----------------------------------------------------------------------------
// useToggler Hook
// Utility hook for toggling boolean state
// -----------------------------------------------------------------------------

import { useCallback, useState, useEffect } from 'react';

/**
 * Hook used for toggling boolean state
 * @param initialActiveState - Initial state value
 */
export const useToggler = (initialActiveState: boolean = false) => {
  const [isActive, setIsActive] = useState(initialActiveState);
  
  const toggle = useCallback(() => setIsActive(state => !state), []);
  
  const setActive = useCallback((value: boolean) => setIsActive(value), []);

  useEffect(() => {
    setIsActive(initialActiveState);
  }, [initialActiveState]);

  return { isActive, toggle, setActive };
};

export default useToggler;
