import { useCallback, useState, useEffect } from 'react';

/**
 * Hook used for toggling
 * @param initialActiveState
 */
const useToggler = (initialActiveState: boolean) => {
  const [isActive, setShowMore] = useState(initialActiveState);
  const toggle = useCallback(() => setShowMore(state => !state), []);

  useEffect(() => {
    setShowMore(initialActiveState);
  }, [initialActiveState]);

  return { isActive, toggle };
};

export default useToggler;
