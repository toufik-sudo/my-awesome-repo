// -----------------------------------------------------------------------------
// useUserData Hook
// Retrieves and manages current user data via UserContext
// -----------------------------------------------------------------------------

import { useUserContext } from '@/contexts/UserContext';

/**
 * Hook used to retrieve user data - wraps UserContext for backward compatibility
 */
export const useUserData = () => {
  const { 
    userData, 
    isLoading, 
    imgLoaded, 
    setImgLoaded, 
    refreshUserData 
  } = useUserContext();

  return { 
    userData, 
    imgLoaded, 
    setImgLoaded, 
    componentLoading: isLoading,
    refreshUserData 
  };
};

export default useUserData;
