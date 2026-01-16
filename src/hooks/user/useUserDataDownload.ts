import { useState, useContext, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UsersApi from 'api/UsersApi';
import useFileDownload from 'hooks/general/useFileDownload';
import { UserContext } from 'components/App';

const userApi = new UsersApi();
/**
 * Hook used to retrieve & download user personal data
 */
const useUserDataDownload = () => {
  const { formatMessage } = useIntl();
  const { userData = {} } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);

  const exportData = useCallback(async () => {
    if (!userData.uuid) {
      return;
    }

    let data;
    setLoading(true);
    try {
      data = await userApi.exportUserData(userData.uuid);
    } catch (e) {
      toast(formatMessage({ id: 'wall.gdpr.file.download.failed' }));
    }
    setLoading(false);

    return data;
  }, [userData.uuid, formatMessage]);

  const { linkRef, download } = useFileDownload(exportData);

  return { linkRef, download, isLoading };
};

export default useUserDataDownload;
