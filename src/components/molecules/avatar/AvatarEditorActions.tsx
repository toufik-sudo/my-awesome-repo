import React from 'react';

import style from 'assets/style/components/PersonalInformation/AvatarCreator.module.scss';
import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

/**
 * Molecule component used to render avatar editor
 *
 * @param saveImage
 * @param closeModal
 * @constructor
 */
const AvatarEditorActions = ({ saveImage, closeModal }) => {
  return (
    <div className={style.buttonWrapper}>
      <DynamicFormattedMessage onClick={saveImage} tag={Button} id="personalInformation.info.modal.save" />
      <DynamicFormattedMessage
        onClick={closeModal}
        type={BUTTON_MAIN_TYPE.TEXT_ONLY}
        tag={Button}
        id="personalInformation.info.modal.close"
      />
    </div>
  );
};

export default AvatarEditorActions;
