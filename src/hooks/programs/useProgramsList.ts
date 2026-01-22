import { useState, useMemo, useEffect, useCallback } from 'react';

import useUserPlatformRole from 'hooks/user/useUserPlatformRole';
import { prepareProgramsList, filterProgramsByType } from 'services/ProgramServices';
import { retrieveProgramsForPlatform } from 'services/PlatformSelectionServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { IPlatform, IProgram } from 'interfaces/components/wall/IWallPrograms';

/**
 * Hook used to retrieve programs list with hierarchical filtering
 *
 * @implNote `GET /users/{uuid}/programs` API does not yet support all required functionality, thus
 * all programs from the selected platform are fetched from the store and sorted according to the display order.
 * Implementation to be reverted to paginated loading on scroll when the API is ready.
 *
 */
const useProgramsList = () => {
  const [typeFilter, setTypeFilter] = useState<{ value: number | undefined; label: string } | null>(null);
  const { selectedPlatform: storePlatform } = useWallSelection();
  const [selectedPlatform, setSelectedPlatform] = useState(storePlatform);
  const userRole = useUserPlatformRole(selectedPlatform.role);
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(true);
  const [allPrograms, setAllPrograms] = useState<IProgram[]>([]);
  const [allPlatforms, setAllPlatforms] = useState<IPlatform[]>([]);
  const [triggerReload, setTriggerReload] = useState(0);

  // Hierarchical filter states
  const [selectedSuperPlatformFilter, setSelectedSuperPlatformFilter] = useState<IPlatform | null>(null);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<IPlatform | null>(null);
  const [selectedProgramFilter, setSelectedProgramFilter] = useState<IProgram | null>(null);

  useEffect(() => {
    setAllPrograms([]);
    setIsLoadingPlatform(true);
    retrieveProgramsForPlatform(selectedPlatform.id)
      .then(({ selectedPlatform, platforms }) => {
        setAllPlatforms(platforms);
        setSelectedPlatform(selectedPlatform);
        setAllPrograms(selectedPlatform.programs);
      })
      .finally(() => setIsLoadingPlatform(false));
  }, [triggerReload]);

  // Extract super platforms from all platforms
  const superPlatforms = useMemo(() => {
    return allPlatforms.filter(
      p => p.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM
    );
  }, [allPlatforms]);

  // Filter platforms based on selected super platform
  const filteredPlatforms = useMemo(() => {
    if (!selectedSuperPlatformFilter) {
      return allPlatforms.filter(
        p => p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM &&
             p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
      );
    }
    
    // Get sub-platforms of the selected super platform
    return selectedSuperPlatformFilter.subPlatforms || allPlatforms.filter(
      p => p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM &&
           p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
    );
  }, [allPlatforms, selectedSuperPlatformFilter]);

  // Get programs from filtered platforms
  const availablePrograms = useMemo(() => {
    if (selectedPlatformFilter) {
      return selectedPlatformFilter.programs || [];
    }
    
    // Combine all programs from filtered platforms
    const programsSet: IProgram[] = [];
    filteredPlatforms.forEach(platform => {
      if (platform.programs) {
        platform.programs.forEach(prog => {
          if (!programsSet.find(p => p.id === prog.id)) {
            programsSet.push(prog);
          }
        });
      }
    });
    
    return programsSet.length > 0 ? programsSet : allPrograms;
  }, [filteredPlatforms, selectedPlatformFilter, allPrograms]);

  const sortedPrograms = useMemo(() => 
    prepareProgramsList(availablePrograms, selectedPlatform), 
  [
    availablePrograms,
    selectedPlatform
  ]);

  const filteredPrograms = useMemo(() => {
    let programs = sortedPrograms;
    
    // Apply program type filter
    if (typeFilter && typeFilter.value !== undefined) {
      programs = filterProgramsByType(programs, typeFilter);
    }
    
    // Apply program filter if selected
    if (selectedProgramFilter) {
      programs = programs.filter(p => p.id === selectedProgramFilter.id);
    }
    
    return programs;
  }, [
    sortedPrograms,
    typeFilter,
    selectedProgramFilter
  ]);

  // Also filter platforms based on selected filters for display
  const displayPlatforms = useMemo(() => {
    let platforms = allPlatforms;
    
    // If a super platform is selected, show only its sub-platforms
    if (selectedSuperPlatformFilter) {
      platforms = selectedSuperPlatformFilter.subPlatforms || platforms.filter(
        p => p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM &&
             p.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM
      );
    }
    
    // If a specific platform is selected, show only that platform
    if (selectedPlatformFilter) {
      platforms = platforms.filter(p => p.id === selectedPlatformFilter.id);
    }
    
    return platforms;
  }, [allPlatforms, selectedSuperPlatformFilter, selectedPlatformFilter]);

  const triggerReloadPrograms = () => {
    setTriggerReload(triggerReload + 1);
  };

  const onChangePlatform = (index: number) => {
    setSelectedPlatform({ ...allPlatforms[index], index });
    setAllPrograms((allPlatforms[index] || {}).programs || []);
  };

  // Hierarchical filter handlers
  const handleSuperPlatformChange = useCallback((superPlatform: IPlatform | null) => {
    setSelectedSuperPlatformFilter(superPlatform);
    setSelectedPlatformFilter(null);
    setSelectedProgramFilter(null);
  }, []);

  const handlePlatformFilterChange = useCallback((platform: IPlatform | null) => {
    setSelectedPlatformFilter(platform);
    setSelectedProgramFilter(null);
  }, []);

  const handleProgramFilterChange = useCallback((program: IProgram | null) => {
    setSelectedProgramFilter(program);
  }, []);

  const handleProgramTypeChange = useCallback((type: { value: number | undefined; label: string } | null) => {
    setTypeFilter(type);
  }, []);

  return {
    selectedPlatform,
    onChangePlatform,
    triggerReloadPrograms,
    platforms: displayPlatforms,
    programs: filteredPrograms,
    onFilter: handleProgramTypeChange,
    isLoading: isLoadingPlatform,
    userRole,
    // Hierarchical filter data
    superPlatforms,
    filteredPlatforms,
    availablePrograms,
    selectedSuperPlatformFilter,
    selectedPlatformFilter,
    selectedProgramFilter,
    selectedProgramType: typeFilter,
    handleSuperPlatformChange,
    handlePlatformFilterChange,
    handleProgramFilterChange,
    handleProgramTypeChange
  };
};

export default useProgramsList;
