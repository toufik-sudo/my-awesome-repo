import { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import useFileDownload from 'hooks/general/useFileDownload';
import { REQUIRED } from 'constants/validation';
import { DECLARATION_TEMPLATE_DOWNLOAD_TYPE } from 'constants/api/declarations';

const userDeclarationApi = new UserDeclarationApi();
/**
 * Hook used to download user declaration template
 */
const useUserDeclarationTemplateDownload = programId => {
  const { formatMessage } = useIntl();
  const [errors, setErrors] = useState<any>({});

  const downloadTemplate = useCallback(
    async templateType => {
      if (!programId) {
        setErrors({
          programError: REQUIRED
        });
        return;
      }

      try {
        return await userDeclarationApi.getDeclarationTemplate(
          programId,
          DECLARATION_TEMPLATE_DOWNLOAD_TYPE[templateType]
        );
      } catch (e) {
        toast(formatMessage({ id: 'wall.userDeclaration.template.error.failedToDownload' }));
      }
    },
    [programId, formatMessage]
  );

  const { linkRef, download } = useFileDownload(downloadTemplate);

  return {
    errors,
    onTemplateDownload: download,
    linkRef
  };
};

export default useUserDeclarationTemplateDownload;
