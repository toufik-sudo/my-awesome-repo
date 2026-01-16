import React from 'react';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import Button from 'components/atoms/ui/Button';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import modalStyle from 'sass-boilerplate/stylesheets/components/modals/Modals.module.scss';

/**
 *  Confirmation organism component that renders a dynamic modal that doesn't use redux-store
 *
 * @param onAccept
 * @constructor
 */
const LocalModal = ({ isOpen, isLoading = false, closeModal, children, shouldConfirm = false }) => {
  const { modalReset } = modalStyle;

  return (
    <FlexibleModalContainer
      className={modalReset}
      closeModal={() => !shouldConfirm && closeModal()}
      isModalOpen={isOpen}
    >
      <>
        {isOpen && !isLoading && (
          <>
            {children}
            {shouldConfirm && (
              <DynamicFormattedMessage
                tag={Button}
                type={BUTTON_MAIN_TYPE.DANGER}
                onClick={closeModal}
                id="modal.confirmation.ok"
              />
            )}
          </>
        )}
        {isOpen && isLoading && <Loading type={LOADER_TYPE.DROPZONE} />}
      </>
    </FlexibleModalContainer>
  );
};

export default LocalModal;
