import { useEffect, useState, useCallback } from 'react';

import UsersApi from 'api/UsersApi';
import useToggler from 'hooks/general/useToggler';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import useProgramJoinValidation from 'hooks/user/useProgramJoinValidation';
import { PROGRAM_FINISHED, PROGRAM_ONGOING, PROGRAM_JOIN_PENDING } from 'constants/api/userPrograms';
import { groupUserProgramsByStatus, updateProgramsOnJoinValidated } from 'services/UsersServices';

const usersApi = new UsersApi();
/**
 * Hook used to get and manipulate user details data regarding his programs
 */
const useUserProgramsDetailsData = userId => {
  const [programs, setPrograms] = useState({});
  const { isActive: shouldRefresh, toggle: refreshPrograms } = useToggler(false);
  const platformId = usePlatformIdSelection();
  const { confirmJoinAction, validateJoinRequest, isValidatingJoin } = useProgramJoinValidation();

  const handleIsValidatingJoin = useCallback(programId => isValidatingJoin(userId, programId), [
    userId,
    isValidatingJoin
  ]);

  const handleProgramsList = async (userId, platformId) => {
    const userPrograms = await usersApi.getUserPrograms({
      platformId,
      uuid: userId
    });

    const { platforms = [] } = userPrograms.data;
    const { programs = [] } = platforms.length && platforms[0];
    const processedPrograms = groupUserProgramsByStatus(programs);

    setPrograms(processedPrograms);
  };

  const handleValidateJoinRequest = useCallback(
    async ({ operation, programId }) => {
      if (await validateJoinRequest({ userId, operation, programId })) {
        setPrograms(programs => updateProgramsOnJoinValidated(programs, { programId, operation }));
      }
    },
    [userId, validateJoinRequest]
  );

  useEffect(() => {
    handleProgramsList(userId, platformId);
  }, [userId, platformId, shouldRefresh]);

  return {
    ongoingList: programs[PROGRAM_ONGOING],
    finishedList: programs[PROGRAM_FINISHED],
    pendingList: programs[PROGRAM_JOIN_PENDING],
    refreshPrograms,
    validateJoinRequest: handleValidateJoinRequest,
    isValidatingJoin: handleIsValidatingJoin,
    confirmJoinAction
  };
};

export default useUserProgramsDetailsData;
