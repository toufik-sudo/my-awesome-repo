import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import usePrevious from 'hooks/general/usePrevious';
import { getProgramUserNumber, setProgramUsersData } from 'store/actions/wallActions';
import { getCurrentUsersData } from 'services/WallServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Hook used to get and set current users in store and state.
 */
const useUserNumber = () => {
  const dispatch = useDispatch();
  const { programUsers, selectedProgramId } = useWallSelection();
  const platformId = usePlatformIdSelection();
  const prevState = usePrevious({ platformId });
  const [isLoading, setLoading] = useState(false);
  const [currentProgramUsers, setCurrentProgramUsers] = useState(getCurrentUsersData(programUsers, selectedProgramId));

  useEffect(() => {
    if (!platformId) {
      return;
    }
    setLoading(true);
    getProgramUserNumber(platformId)
      .then(allProgramsUserNumber => {
        dispatch(setProgramUsersData(allProgramsUserNumber));
        setCurrentProgramUsers(getCurrentUsersData(allProgramsUserNumber, selectedProgramId));
      })
      .finally(() => setLoading(false));
  }, [platformId]);

  useEffect(() => {
    if (prevState && prevState.platformId === platformId) {
      setCurrentProgramUsers(getCurrentUsersData(programUsers, selectedProgramId));
    }
  }, [selectedProgramId]);

  return { currentProgramUsers, isLoading };
};

export default useUserNumber;
