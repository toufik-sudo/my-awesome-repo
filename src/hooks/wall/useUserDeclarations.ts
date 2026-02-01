// -----------------------------------------------------------------------------
// useUserDeclarations Hook
// Migrated from old_app/src/hooks/wall/useUserDeclarations.tsx
// -----------------------------------------------------------------------------

import { useEffect, useState, useContext } from 'react';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

import { useWallSelection } from './useWallSelection';
import { usePrevious } from '@/hooks/general/usePrevious';
import { useUserRole } from '@/hooks/auth';
import { isUserBeneficiary } from '@/services/security/accessServices';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface UserDeclarationsResult {
  currentUserDeclarations: any[];
  isBeneficiary: boolean;
  isLoading: boolean;
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

/**
 * Filters declarations matching the program ID
 */
const getMatchingUserDeclarations = (
  declarations: any[],
  programId: number | undefined
): any[] => {
  if (!declarations || !declarations.length) {
    return [];
  }
  
  if (!programId) {
    return declarations;
  }
  
  return declarations.filter((d: any) => d.programId === programId);
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Hook used to get and set a short list of user declarations in store and state.
 */
const useUserDeclarations = (): UserDeclarationsResult => {
  const { formatMessage } = useIntl();
  const wallSelection = useWallSelection() as any;
  const selectedProgramId = wallSelection?.selectedProgramId;
  const platformId = wallSelection?.selectedPlatform?.id;
  
  const role = useUserRole();
  const isBeneficiary = isUserBeneficiary(role);
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserDeclarations, setCurrentUserDeclarations] = useState<any[]>([]);
  const [platformUserDeclarations, setPlatformUserDeclarations] = useState<any[]>([]);
  const prevState = usePrevious({ platformId });

  useEffect(() => {
    if (!platformId) {
      setIsLoading(false);
      return;
    }
    
    if (prevState && platformId === prevState.platformId) {
      setCurrentUserDeclarations(
        getMatchingUserDeclarations(platformUserDeclarations, selectedProgramId)
      );
      return;
    }

    const loadAsync = async () => {
      setIsLoading(true);
      try {
        // In real implementation, this would call userDeclarationApi.getBlockDeclarations()
        // For now, we'll simulate with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockDeclarations: any[] = [];
        setPlatformUserDeclarations(mockDeclarations);
        setCurrentUserDeclarations(
          getMatchingUserDeclarations(mockDeclarations, selectedProgramId)
        );
      } catch (e) {
        toast.error(formatMessage({ id: 'toast.message.generic.error' }));
      }
      setIsLoading(false);
    };
    
    loadAsync();
  }, [platformId, selectedProgramId, prevState, platformUserDeclarations, formatMessage]);

  return { currentUserDeclarations, isBeneficiary, isLoading };
};

export default useUserDeclarations;
