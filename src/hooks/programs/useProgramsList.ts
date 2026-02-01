// -----------------------------------------------------------------------------
// useProgramsList Hook
// Retrieves and manages programs list with filtering
// -----------------------------------------------------------------------------

import { useState, useMemo, useEffect, useCallback } from 'react';

import { useWallSelection } from '@/hooks/wall/useWallSelection';
import { useUserRole } from '@/hooks/auth';
import { 
  prepareProgramsList, 
  filterProgramsByType,
  type IPlatform,
  type IProgram,
  type IPreparedProgram,
} from '@/services/programs';

interface TypeFilter {
  value: number | undefined;
  label: string;
}

/**
 * Hook used to retrieve programs list with hierarchical filtering
 */
export const useProgramsList = () => {
  const { selectedPlatform: storePlatform } = useWallSelection();
  const [selectedPlatform, setSelectedPlatform] = useState<IPlatform | null>(null);
  const userRole = useUserRole();
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(false);
  const [allPrograms, setAllPrograms] = useState<IProgram[]>([]);
  const [allPlatforms, setAllPlatforms] = useState<IPlatform[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter | null>(null);

  const sortedPrograms = useMemo((): IPreparedProgram[] => {
    if (!selectedPlatform) return [];
    return prepareProgramsList(allPrograms, selectedPlatform.id);
  }, [allPrograms, selectedPlatform]);

  const filteredPrograms = useMemo(() => {
    if (typeFilter && typeFilter.value !== undefined) {
      return filterProgramsByType(sortedPrograms, typeFilter);
    }
    return sortedPrograms;
  }, [sortedPrograms, typeFilter]);

  const handleProgramTypeChange = useCallback((type: TypeFilter | null) => {
    setTypeFilter(type);
  }, []);

  return {
    selectedPlatform,
    platforms: allPlatforms,
    programs: filteredPrograms,
    onFilter: handleProgramTypeChange,
    isLoading: isLoadingPlatform,
    userRole,
  };
};

export default useProgramsList;
