import React from 'react';

import Button from 'components/atoms/ui/Button';
import ButtonClose from 'components/atoms/ui/ButtonClose';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import useAddDeclarationModal from 'hooks/declarations/useAddDeclarationModal';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { USER_DECLARATION_ADD_FORM_ROUTE, USER_DECLARATION_UPLOAD_ROUTE } from 'constants/routes';

import basicStyle from 'assets/style/components/Modals/Modal.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render declaration type choice modal on adding new result
 *
 * @constructor
 */
const AddUserDeclarationModal = () => {
  const { userDeclarationModalControls } = style;
  const { active, navigateTo, closeModal } = useAddDeclarationModal();

  return (
    <FlexibleModalContainer
      fullOnMobile={false}
      animationClass={coreStyle.w90}
      isModalOpen={active}
      closeModal={closeModal}
      className={basicStyle.smallModal}
    >
      <div>
        <ButtonClose closeModal={closeModal} isAlt />
        <DynamicFormattedMessage
          className={coreStyle.my1}
          tag={HTML_TAGS.H4}
          id="wall.userDeclarations.add.new.result"
        />
        <div className={userDeclarationModalControls}>
          <DynamicFormattedMessage
            onClick={() => navigateTo(USER_DECLARATION_ADD_FORM_ROUTE)}
            tag={Button}
            id="wall.userDeclarations.add.form"
          />
          <DynamicFormattedMessage
            onClick={() => navigateTo(USER_DECLARATION_UPLOAD_ROUTE)}
            tag={Button}
            id="wall.userDeclarations.add.fileUpload"
          />
        </div>
      </div>
    </FlexibleModalContainer>
  );
};

export default AddUserDeclarationModal;
