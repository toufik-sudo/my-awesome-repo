import { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import PointsApi from 'api/PointsApi';
import { EDIT_POINTS_CONVERSION_STATUS } from 'constants/wall/points';
import { setAgendaReload } from 'store/actions/wallActions';
import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';
import { PostListContext } from 'components/molecules/wall/blocks/WallBaseBlock';

const pointsApi = new PointsApi();

/**
 * hook used for handling the approval of a point conversion.
 * @param id
 */
export function usePointsConversionApproval(id) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectingEntity, setIsSelectingEntity] = useState(false);
  const [isAccepting, setIsAccepting] = useState(true);
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [didSubmit, setDidSubmit] = useState(false);
  const { setTriggerPin } = useContext(PostListContext);

  const onEditPointsConversion = async isAccepted => {
    if (isLoading) {
      return;
    }
    setIsAccepting(isAccepted);
    const actionSuccessMessageId = `toast.message.points.converted.${isAccepted ? 'accept' : 'decline'}.success`;
    try {
      setIsLoading(true);
      const { DECLINE, ACCEPT } = EDIT_POINTS_CONVERSION_STATUS;
      const payload = { data: [{ operation: isAccepted ? ACCEPT : DECLINE, id }] };
      await pointsApi.validatePointsConversion(payload);
      setDidSubmit(true);
      await dispatch(setAgendaReload(true));
      toast(formatMessage({ id: actionSuccessMessageId }));
      setTriggerPin(i => i + 1);
    } catch (e) {
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
    setIsLoading(false);
  };

  const openConfirmModal = isAccepted => {
    dispatch(setModalState(true, CONFIRMATION_MODAL, { isAccepted }));
    setIsSelectingEntity(true);
  };

  const onCloseModal = () => {
    setIsSelectingEntity(false);
  };

  return {
    isLoading,
    isSelectingEntity,
    isAccepting,
    didSubmit,
    onEditPointsConversion,
    openConfirmModal,
    onCloseModal
  };
}
