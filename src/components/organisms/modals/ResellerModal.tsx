import React from 'react';

import resellerModalStyles from 'assets/style/components/ResellerForm.module.scss';
import ResellerFormWrapper from 'components/organisms/form-wrappers/ResellerFormWrapper';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { RESELLER_MODAL } from 'constants/modal';

/**
 * Template component that renders modal container which contains the reseller form
 *
 * @param closeResellerModal
 * @param intl
 * @param resellerModalState
 * @constructor
 */
const ResellerModal = ({ closeResellerModal, resellerModalState }) => {
  document.documentElement.className = '';

  if (resellerModalState) {
    document.documentElement.className = RESELLER_MODAL;
  }

  return (
    <FlexibleModalContainer
      closeModal={closeResellerModal}
      isModalOpen={resellerModalState}
      className={resellerModalStyles.resellerFormModal}
    >
      <ResellerFormWrapper onClick={closeResellerModal} />
    </FlexibleModalContainer>
  );
};

export default ResellerModal;
