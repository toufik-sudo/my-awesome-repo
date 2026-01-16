import { useEffect, useState } from 'react';
import { retrieveOnboardingBeneficiaryCookie } from 'utils/LocalStorageUtils';

/**
 * Hook used to get program details
 */
export const useStoredProgramData = () => {
  const [programDetails, setProgramDetails] = useState(null);

  useEffect(() => {
    setProgramDetails(retrieveOnboardingBeneficiaryCookie());
  }, []);

  return { programDetails };
};
