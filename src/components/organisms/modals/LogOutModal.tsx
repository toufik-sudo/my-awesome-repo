import React from 'react';

import FlexibleModalContainer from '../../../containers/FlexibleModalContainer';
import Button from '../../atoms/ui/Button';
import useLogOutModalData from '../../../hooks/modals/useLogOutModalData';
import { DynamicFormattedMessage } from '../../atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/components/Modals/LogoutModal.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Logout organism component that renders two buttons
 *
 * @constructor
 */
const LogOutModal = () => {
  const { logoutUser, closeModal, logoutStateModal } = useLogOutModalData();
  const { logOutModal, title } = style;

  return (
    <>
      <FlexibleModalContainer
        fullOnMobile={false}
        className={logOutModal}
        closeModal={closeModal}
        isModalOpen={logoutStateModal.active}
        animationClass={coreStyle.widthFull}
      >
        <div>
          <DynamicFormattedMessage tag={HTML_TAGS.H4} className={title} id="logout.label.are.you.sure" />
          <DynamicFormattedMessage tag={Button} onClick={logoutUser} id="logout.cta.yes" />
          <DynamicFormattedMessage
            tag={Button}
            type={BUTTON_MAIN_TYPE.DANGER}
            onClick={closeModal}
            id="logout.cta.no"
          />
        </div>
      </FlexibleModalContainer>
    </>
  );
};

export default LogOutModal;
