import qs from 'qs';

import { PROGRAM_ID } from 'constants/wall/launch';
import { PLATFORM_ID } from 'constants/routes';

/**
 * Checks the query param provided programId and platformId and overwrites the store values
 *
 * @param selectedProgramId
 * @param selectedPlatformId
 */
export const getRouteForcedParams = (selectedProgramId, selectedPlatformId: number) => {
  const params = qs.parse(window.location.search.slice(1));

  return {
    programId: params[PROGRAM_ID] && params[PLATFORM_ID] ? Number(params[PROGRAM_ID]) : selectedProgramId,
    platformId: Number(params[PLATFORM_ID]) || selectedPlatformId
  };
};
