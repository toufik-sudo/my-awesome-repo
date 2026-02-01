// -----------------------------------------------------------------------------
// useUserRankings Hook
// Migrated from old_app/src/hooks/wall/blocks/useUserRankings.tsx
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

import { useWallSelection } from './useWallSelection';
import { mapUserRankings } from '@/services/wall/blocks';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SelectedRanking {
  id?: number;
  rank?: number;
  nameId?: string;
}

interface UserRankingsResult {
  isLoading: boolean;
  selectedRanking: SelectedRanking;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Loads current logged user rankings and maps them
 */
const useUserRankings = (): UserRankingsResult => {
  const { formatMessage } = useIntl();
  const wallSelection = useWallSelection() as any;
  const platformId = wallSelection?.selectedPlatform?.id;
  const programId = wallSelection?.selectedProgramId;
  const userRankings = wallSelection?.userRankings || {};
  const selectedRanking = userRankings?.selectedRanking || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!platformId) {
      return;
    }

    setIsLoading(true);
    
    // In real implementation, this would call userApi.getUserRankings()
    // For now, we'll simulate with a timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [platformId, programId]);

  return { isLoading, selectedRanking };
};

export default useUserRankings;
