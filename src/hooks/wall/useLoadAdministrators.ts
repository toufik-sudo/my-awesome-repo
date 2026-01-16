import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UserApi from 'api/UsersApi';
import PlatformApi from 'api/PlatformApi';
import useUserPlatformRole from 'hooks/user/useUserPlatformRole';
import { USER_PROGRAM_STATUS } from 'constants/api/userPrograms';
import { useUserData } from 'hooks/user/useUserData';
import { isAtLeastSuperAdmin } from 'services/security/accessServices';

/**
 * Loads the administrators for a given platformId
 * @param platform
 */
const platformApi = new PlatformApi();
const useLoadAdministrators = platform => {
  const { id: platformId } = platform;
  const { formatMessage } = useIntl();
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [administrators, setAdministrators] = useState([]);
  const [isAssignDisable, setAssignDisable] = useState(true);
  const { userData } = useUserData();
  const userRole = useUserPlatformRole(platform.role);

  useEffect(() => {
    const shouldNotDisableAssign = (userData && isAtLeastSuperAdmin(userRole)) || !platform.platformType;
    if (shouldNotDisableAssign) {
      setAssignDisable(false);
    }

    if (!(platform && (platform as any).platformType && administrators.length && userData)) {
      return;
    }

    platformApi.getPlatformTypes().then(platformTypes => {
      const currentPlatformType = platformTypes.find(
        platformType => platformType.id === (platform as any).platformType.id
      );
      const activeAdministrators =
        administrators.length && administrators.filter(item => item.status === USER_PROGRAM_STATUS.ACTIVE);
      if (
        !shouldNotDisableAssign &&
        currentPlatformType &&
        currentPlatformType.nrOfAdmins &&
        activeAdministrators.length < currentPlatformType.nrOfAdmins
      ) {
        setAssignDisable(false);
      }
    });
  }, [platform, administrators, userData]);

  useEffect(() => {
    setIsLoading(true);
    new UserApi()
      .getAdmins(platformId)
      .then(({ data }) => setAdministrators(data.data))
      .catch(() => toast(formatMessage({ id: 'toast.message.generic.error' })))
      .finally(() => setIsLoading(false));
  }, [platformId, reloadKey]);

  const reloadAdministrators = () => {
    setReloadKey(reloadKey + 1);
  };
  return { reloadAdministrators, isLoading, administrators, isAssignDisable };
};

export default useLoadAdministrators;
