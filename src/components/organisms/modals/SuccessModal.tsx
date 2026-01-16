import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import SuccessModalBody from 'components/organisms/modals-body/SuccessModalBody';
import { SUCCESS_MODAL } from 'constants/modal';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';
import style from 'assets/style/components/Modals/Modal.module.scss';

/**
 * Organism component used to render on every success form submit
 * @param closeButtonHidden
 * @param isOnboardingFlow
 *
 * @constructor
 */
const SuccessModal = ({ closeButtonHidden, isOnboardingFlow }) => {
  const { modalSuccess, modalSuccessTransparent } = style;
  const dispatch = useDispatch();
  const successModal = useSelector((state: IStore) => state.modalReducer.successModal);
  const closeResellerModal = useCallback(() => dispatch(setModalState(false, SUCCESS_MODAL)), [dispatch]);
  const isSuccessModalReseller = successModal.data.customStyle;

  return (
    <FlexibleModalContainer
      isModalOpen={successModal.active}
      closeModal={closeResellerModal}
      className={`${modalSuccess} ${isSuccessModalReseller} ${modalSuccessTransparent}`}
      fullOnMobile={false}
    >
      <SuccessModalBody
        onClick={closeResellerModal}
        closeButtonHidden={closeButtonHidden}
        data={successModal.data}
        isResetModal={successModal.data.type}
        isOnboardingFlow={isOnboardingFlow}
      />
    </FlexibleModalContainer>
  );
};

export default SuccessModal;
