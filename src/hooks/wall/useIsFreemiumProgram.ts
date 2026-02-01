// -----------------------------------------------------------------------------
// useIsFreemiumProgram Hook
// Checks if the currently selected program is a freemium type
// -----------------------------------------------------------------------------

import { useMemo } from 'react';
import { useWallSelection } from './useWallSelection';
import { PROGRAM_TYPES } from '@/constants/wall/launch';

/**
 * Hook to determine if the currently selected program is freemium
 */
export const useIsFreemiumProgram = (): boolean => {
  const { programs, selectedProgramId, programDetails } = useWallSelection();

  return useMemo(() => {
    // If no program selected, check all programs in context
    if (!selectedProgramId) {
      return false;
    }

    // First check programDetails for type
    const details = programDetails?.[selectedProgramId];
    if (details?.type === PROGRAM_TYPES.freemium) {
      return true;
    }

    // Otherwise check the program in the programs array
    const selectedProgram = programs.find(p => p.id === selectedProgramId);
    if (selectedProgram?.programType === PROGRAM_TYPES.freemium) {
      return true;
    }

    return false;
  }, [programs, selectedProgramId, programDetails]);
};

export default useIsFreemiumProgram;
