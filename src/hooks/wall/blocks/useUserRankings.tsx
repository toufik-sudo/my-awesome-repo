import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import UserApi from 'api/UsersApi';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { setUserRankings } from 'store/actions/wallActions';
import { mapUserRankings } from 'services/wall/blocks';
import { getUserUuid } from 'services/UserDataServices';
import axios from 'axios';

const userApi = new UserApi();
/**
 * Loads current logged user rankings and maps them
 */
const useUserRankings = () => {
  const {
    selectedPlatform: { id: platformId },
    selectedProgramId: programId,
    userRankings: { selectedRanking }
  } = useWallSelection();
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const source = axios.CancelToken.source();
    
    if (!platformId) {
      return;
    }

    setIsLoading(true);
    userApi
      .getUserRankings(getUserUuid(), source)
      .then(({ data: { platforms } }) => {
        dispatch(setUserRankings(mapUserRankings(platforms, programId, platformId)));
        // setIsLoading(false);
      })
      .catch((error) => {
        // setIsLoading(false);
        toast(formatMessage({ id: 'toast.message.generic.error' }));
      })
      .finally(() => setIsLoading(false));

    return()=>{
      setIsLoading(false);
      source.cancel();
    }
  }, [platformId, programId]);

  return { isLoading, selectedRanking };
};

export default useUserRankings;
