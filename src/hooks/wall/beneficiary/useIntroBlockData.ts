import { useState } from 'react';

import UserApi from 'api/UsersApi';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';
import { USER_STATUS_OPERATION } from 'constants/wall/design';
import { getUserDetails } from 'services/UserDataServices';

const userApi = new UserApi();

/**
 * Hook used to handle intro block data
 *
 */
export const useIntroBlockData = () => {
  const { selectedProgramId, selectedProgramIndex, programs } = useWallSelection();
  const isPeopleManager = programs[selectedProgramIndex] && programs[selectedProgramIndex].isPeopleManager;
  const programDetails = useWallSelection().programDetails[selectedProgramId] || {};
  const [isBodyOpen, setBody] = useState(false);
  const userData = getUserDetails();

  useUpdateEffect(() => {
    if (programDetails.visitedWall !== undefined && userData.uuid && !programDetails.visitedWall) {
      setBody(!programDetails.visitedWall);
      userApi.updateProgramUsers(selectedProgramId, userData.uuid, USER_STATUS_OPERATION.VISITED);
    }
  }, [programDetails, userData.uuid]);

  return {
    isProgramSelected: !!selectedProgramId,
    isPeopleManager,
    isBodyOpen,
    setBody,
    isIntroLoading: !programDetails || !programDetails.didLoad,
    programDetails
  };
};
