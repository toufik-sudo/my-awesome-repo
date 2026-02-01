// -----------------------------------------------------------------------------
// useUserNumber Hook
// Migrated from old_app/src/hooks/wall/useUserNumber.tsx
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useWallSelection } from './useWallSelection';
import { usePlatformIdSelection } from './useWallSelection';
import { usePrevious } from '@/hooks/general/usePrevious';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface UserNumberResult {
  currentProgramUsers: number;
  isLoading: boolean;
}

interface ProgramUsersData {
  data: any[];
  total: number;
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

/**
 * Gets current users data based on program selection
 */
const getCurrentUsersData = (
  programUsers: ProgramUsersData,
  selectedProgramId: number | undefined
): number => {
  if (!programUsers || !programUsers.total) {
    return 0;
  }
  
  if (selectedProgramId && programUsers.data) {
    const programData = programUsers.data.find((p: any) => p.id === selectedProgramId);
    return programData?.userCount || programUsers.total;
  }
  
  return programUsers.total;
};

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Hook used to get and set current users in store and state.
 */
const useUserNumber = (): UserNumberResult => {
  const dispatch = useDispatch();
  const wallSelection = useWallSelection() as any;
  const programUsers = wallSelection?.programUsers || { data: [], total: 0 };
  const selectedProgramId = wallSelection?.selectedProgramId;
  const platformId = usePlatformIdSelection();
  
  const prevState = usePrevious({ platformId });
  const [isLoading, setLoading] = useState(false);
  const [currentProgramUsers, setCurrentProgramUsers] = useState(
    getCurrentUsersData(programUsers, selectedProgramId)
  );

  // Load user count when platform changes
  useEffect(() => {
    if (!platformId) {
      return;
    }
    setLoading(true);
    
    // In real implementation, this would call getProgramUserNumber(platformId)
    // For now, we'll simulate with a timeout
    const timer = setTimeout(() => {
      setCurrentProgramUsers(getCurrentUsersData(programUsers, selectedProgramId));
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [platformId]);

  // Update user count when program changes
  useEffect(() => {
    if (prevState && prevState.platformId === platformId) {
      setCurrentProgramUsers(getCurrentUsersData(programUsers, selectedProgramId));
    }
  }, [selectedProgramId, prevState, platformId, programUsers]);

  return { currentProgramUsers, isLoading };
};

export default useUserNumber;
