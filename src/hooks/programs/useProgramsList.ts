import { useState, useMemo, useEffect } from 'react';

import useUserPlatformRole from 'hooks/user/useUserPlatformRole';
import { prepareProgramsList, filterProgramsByType } from 'services/ProgramServices';
import { retrieveProgramsForPlatform } from 'services/PlatformSelectionServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Hook used to retrieve programs list
 *
 * @implNote `GET /users/{uuid}/programs` API does not yet support all required functionality, thus
 * all programs from the selected platform are fetched from the store and sorted according to the display order.
 * Implementation to be reverted to paginated loading on scroll when the API is ready.
 *
 */
const useProgramsList = () => {
  const [typeFilter, setTypeFilter] = useState<any>();
  const { selectedPlatform: storePlatform } = useWallSelection();
  const [selectedPlatform, setSelectedPlatform] = useState(storePlatform);
  const userRole = useUserPlatformRole(selectedPlatform.role);
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(true);
  const [allPrograms, setAllPrograms] = useState([]);
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [triggerReload, setTriggerReload] = useState(0);

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

  const sortedPrograms = useMemo(() => 
    prepareProgramsList(allPrograms, selectedPlatform), 
  [
    allPrograms,
    selectedPlatform
  ]);

  const filteredPrograms = useMemo(() => 
    filterProgramsByType(sortedPrograms, typeFilter), 
  [
    sortedPrograms,
    typeFilter
  ]);

  const triggerReloadPrograms = () => {
    setTriggerReload(triggerReload + 1);
  };

  const onChangePlatform = index => {
    setSelectedPlatform({ ...allPlatforms[index], index });
    setAllPrograms((allPlatforms[index] || {}).programs || []);
  };

  return {
    selectedPlatform,
    onChangePlatform,
    triggerReloadPrograms,
    platforms: allPlatforms,
    programs: filteredPrograms,
    onFilter: setTypeFilter,
    isLoading: isLoadingPlatform,
    userRole
  };
};

export default useProgramsList;
