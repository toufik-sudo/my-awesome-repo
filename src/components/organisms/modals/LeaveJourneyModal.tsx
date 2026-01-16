import React from 'react';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';

import style from 'assets/style/components/Modals/LogoutModal.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 *
 * @param visible
 * @param onCancel
 * @param onConfirm
 * @param titleId
 * @constructor
 */
const LeaveJourneyModal = ({ visible, onCancel, onConfirm, titleId }) => {
  const { logOutModal, title } = style;

  return (
    <FlexibleModalContainer
      fullOnMobile={false}
      className={logOutModal}
      closeModal={onCancel}
      isModalOpen={visible}
      animationClass={coreStyle.widthFull}
    >
      <div className={coreStyle.widthFull}>
        <DynamicFormattedMessage tag={HTML_TAGS.H4} className={title} id={titleId} />
        <DynamicFormattedMessage tag={Button} onClick={onCancel} id="modal.exit.resume" />
        <DynamicFormattedMessage tag={Button} type={BUTTON_MAIN_TYPE.DANGER} onClick={onConfirm} id="modal.exit.quit" />
      </div>
    </FlexibleModalContainer>
  );
};

export default LeaveJourneyModal;
