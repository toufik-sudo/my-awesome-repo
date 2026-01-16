import { useContext, useEffect, useState } from 'react';

import usePrevious from 'hooks/general/usePrevious';
import { getMatchingUserDeclarations } from 'services/WallServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';
import { UserContext } from '../../components/App';
import UserDeclarationApi from '../../api/UserDeclarationsApi';
import { BASE_USER_DECLARATIONS_BLOCK_FILTER } from '../../constants/api/declarations';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { useUserRole } from 'hooks/user/useUserRole';
import axios from 'axios';

const userDeclarationApi = new UserDeclarationApi();
/**
 * Hook used to get and set a short list of user declarations in store and state.
 */
const useUserDeclarations = () => {
  const {
    selectedProgramId: programId,
    selectedPlatform: { id: platformId }
  } = useWallSelection();
  const {
    userData: { uuid }
  } = useContext(UserContext);

  const role = useUserRole();
  const isBeneficiary = isUserBeneficiary(role);
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserDeclarations, setCurrentUserDeclarations] = useState([]);
  const [platformUserDeclarations, setPlatformUserDeclarations] = useState([]);
  const prevState = usePrevious({ platformId });

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (!platformId) {
      setIsLoading(false);
      return;
    }
    if (prevState && platformId === prevState.platformId) {
      return setCurrentUserDeclarations(getMatchingUserDeclarations(platformUserDeclarations, programId));
    }

    const loadAsync = async () => {
      setIsLoading(true);
      try {
        const userDeclarationsOnPlatform = await userDeclarationApi.getBlockDeclarations({
          ...BASE_USER_DECLARATIONS_BLOCK_FILTER,
          platformId,
          uuid: isBeneficiary ? uuid : undefined
        }, source);
        setPlatformUserDeclarations(userDeclarationsOnPlatform);
        setCurrentUserDeclarations(getMatchingUserDeclarations(userDeclarationsOnPlatform, programId));
      } catch (e) {
        toast(formatMessage({ id: 'toast.message.generic.error' }));
      }
      setIsLoading(false);
      return()=>{
        source.cancel();
      }
    };
    loadAsync();
  }, [platformId, programId]);

  return { currentUserDeclarations, isBeneficiary, isLoading };
};

export default useUserDeclarations;
