import React from 'react';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import Button from 'components/atoms/ui/Button';
import useConfirmationModalData from 'hooks/modals/useConfirmationModalData';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { HTML_TAGS } from 'constants/general';
import { emptyFn } from 'utils/general';

import style from 'assets/style/components/Modals/LogoutModal.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 *  Confirmation organism component that renders two buttons
 *
 * @param onAccept
 * @param onClose
 * @param question
 * @param confirmLabel
 * @param confirmButtonType
 * @param denyLabel
 * @param denyButtonType
 * @param onAcceptArgs
 * @param showCloseButton
 * @constructor
 */
const ConfirmationModal = ({
  onAccept,
  onClose = emptyFn,
  question = 'confirmation.label.are.you.sure',
  confirmLabel = 'confirmation.cta.yes',
  confirmButtonType = BUTTON_MAIN_TYPE.PRIMARY,
  denyLabel = 'confirmation.cta.no',
  denyButtonType = BUTTON_MAIN_TYPE.DANGER,
  onAcceptArgs = 'selectedId',
  showCloseButton = true
}) => {
  const { confirmAction, closeModal, isActive, data } = useConfirmationModalData(onAccept, onAcceptArgs, onClose);
  const { logOutModal, title } = style;

  return (
    <FlexibleModalContainer
      className={logOutModal}
      fullOnMobile={false}
      closeModal={closeModal}
      isModalOpen={isActive}
      animationClass={coreStyle.widthFull}
    >
      {isActive && (
        <div className={coreStyle.widthFull}>
          <DynamicFormattedMessage tag={HTML_TAGS.H4} className={title} id={question} values={data} />
          <DynamicFormattedMessage tag={Button} type={confirmButtonType} onClick={confirmAction} id={confirmLabel} />
          {showCloseButton && (
            <DynamicFormattedMessage tag={Button} type={denyButtonType} onClick={closeModal} id={denyLabel} />
          )}
        </div>
      )}
    </FlexibleModalContainer>
  );
};

export default ConfirmationModal;
