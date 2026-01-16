import { useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import qs from 'qs';

import { useWallSelection } from 'hooks/wall/useWallSelection';
import { PLATFORM_ID } from 'constants/routes';
import { PROGRAM_ID, PROGRAM_NAME } from 'constants/wall/launch';

/**
 * Hook used to modify the route accordingly to the current selected platform and program
 */
export const useProgramRouteModifier = () => {
  const {
    selectedProgramId,
    selectedProgramName,
    selectedPlatform: { id: selectedPlatformId }
  } = useWallSelection();
  const history = useHistory();
  const { state } = useLocation();

  useEffect(() => {
    const parsedPath = qs.parse(history.location.search.slice(1));
    if (!selectedPlatformId) {
      return;
    }
    const shallowEquality =
      selectedPlatformId == parsedPath[PLATFORM_ID] && selectedProgramId == parsedPath[PROGRAM_ID];
    if (shallowEquality) {
      return;
    }
    parsedPath[PLATFORM_ID] = selectedPlatformId;
    parsedPath[PROGRAM_ID] = selectedProgramId;
    parsedPath[PROGRAM_NAME] = selectedProgramId && selectedProgramName;
    history.replace(`${history.location.pathname}?${qs.stringify(parsedPath, { skipNulls: true })}`, state);
  }, [selectedProgramId, selectedPlatformId, selectedProgramName, history.location.pathname]);
};
