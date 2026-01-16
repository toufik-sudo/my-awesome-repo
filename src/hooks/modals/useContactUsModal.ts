import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import ContactUsApi from 'api/ContactUsApi';
import { emptyFn } from 'utils/general';

const contactUsApi = new ContactUsApi();

/**
 * ContactUs hook used to manage contactUs modal actions,store
 * */
const useContactUsModal = () => {
  const { formatMessage } = useIntl();
  // No need to do anything here, as general ConfirmationModal is used here,
  // so it closes itself when onClose action triggers
  const closeModal = () => emptyFn();

  const contactUs = async (index, platformId) => {
    try {
      await contactUsApi.contactUs(platformId, index);
    } catch (e) {
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
  };

  return { contactUs, closeModal };
};

export default useContactUsModal;
