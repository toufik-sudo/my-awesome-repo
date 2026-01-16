import React from 'react';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { HTML_TAGS } from 'constants/general';
import useValidatePointConversionModal from 'hooks/modals/useValidatePointConversionModal';

import style from 'assets/style/components/Modals/LogoutModal.module.scss';

/**
 * Organism component used to render validate point conversion Modal
 * @param onSuccess
 * @constructor
 */
const ValidatePointConversionModal = ({ onSuccess }) => {
  const { closeModal, confirmModal, validatePointConversionModalState } = useValidatePointConversionModal(onSuccess);
  const { logOutModal, title } = style;

  return (
    <FlexibleModalContainer
      className={logOutModal}
      closeModal={closeModal}
      isModalOpen={validatePointConversionModalState.active}
    >
      <div>
        <DynamicFormattedMessage tag={HTML_TAGS.H4} className={title} id="pointsConversions.modal.validate" />
        <DynamicFormattedMessage onClick={confirmModal} tag={Button} id="confirmation.cta.yes" />
        <DynamicFormattedMessage
          tag={Button}
          type={BUTTON_MAIN_TYPE.DANGER}
          onClick={closeModal}
          id="confirmation.cta.no"
        />
      </div>
    </FlexibleModalContainer>
  );
};

export default ValidatePointConversionModal;
