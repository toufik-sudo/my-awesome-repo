import { useIntl } from 'react-intl';

import { OLD_BROWSER_MSG_LIST } from 'constants/oldBrowser';

/**
 * Hook used to handle translation messages
 */
export const useFormatMsgTranslation = () => {
  const { formatMessage } = useIntl();
  const msgTranslations = {};
  OLD_BROWSER_MSG_LIST.forEach(item => {
    msgTranslations[item] = formatMessage({
      id: `oldBrowser.modal.${item}`
    });
  });

  return msgTranslations;
};
