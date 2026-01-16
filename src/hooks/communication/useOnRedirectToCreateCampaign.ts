import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import CommunicationsApi from 'api/CommunicationsApi';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { COMMUNICATION_FORM_EMAIL_CAMPAIGN_ROUTE, COMMUNICATION_FORM_CREATE_USER_LIST_ROUTE } from 'constants/routes';
import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';
import { isNotFound } from 'utils/api';
import { setIsProgramSelectionLocked } from 'store/actions/wallActions';

const communicationsApi = new CommunicationsApi();

/**
 *Uses selected programId to retrieve all user lists that for that
 *
 * @param programId
 */
const useOnRedirectToCreateCampaign = (programId: number) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const areAllProgramsSelected = !programId;
  const [isOnRedirectLoading, setIsRedirectLoading] = useState(false);
  const platformId = usePlatformIdSelection();

  const onRedirectToCreateEmailCampaign = useCallback(() => {
    dispatch(setIsProgramSelectionLocked(true));
    setIsRedirectLoading(true);
    communicationsApi
      .getListData({ platformId, programId })
      .then(({ data: { data: userLists } }) => {
        const shouldRedirect = !!userLists.find(({ total }) => total > 0);
        if (shouldRedirect) {
          return history.push(COMMUNICATION_FORM_EMAIL_CAMPAIGN_ROUTE);
        }
        dispatch(setModalState(true, CONFIRMATION_MODAL));
      })
      .catch(({ response }) => {
        if (isNotFound(response)) {
          return dispatch(setModalState(true, CONFIRMATION_MODAL));
        }
        dispatch(setIsProgramSelectionLocked(false));
        toast(formatMessage({ id: 'toast.message.generic.error' }));
      })
      .finally(() => setIsRedirectLoading(false));
  }, [programId, platformId]);

  useEffect(() => {
    return () => {
      dispatch(setModalState(false, CONFIRMATION_MODAL));
    };
  }, []);

  const onConfirmCreateUserList = () => {
    dispatch(setModalState(false, CONFIRMATION_MODAL));
    history.push(COMMUNICATION_FORM_CREATE_USER_LIST_ROUTE);
  };

  return { areAllProgramsSelected, isOnRedirectLoading, onRedirectToCreateEmailCampaign, onConfirmCreateUserList };
};

export default useOnRedirectToCreateCampaign;
