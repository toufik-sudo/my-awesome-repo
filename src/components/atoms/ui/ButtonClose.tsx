import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import style from 'assets/style/components/ResellerForm.module.scss';
import basicStyle from 'assets/style/components/Modals/Modal.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render a close button
 *
 * @constructor
 *
 * @see ButtonStory
 */
const ButtonClose = ({ closeModal, isAlt = false }) => {
  const { withGrayAccentColor, closeModalButtonRight, closeModalButton } = coreStyle;
  return (
    <button
      onClick={closeModal}
      className={`${basicStyle.closeBtn} ${style.closeBtn} ${isAlt ? style.closeBtnAlt : ''} 
    ${closeModalButton} ${closeModalButtonRight}`}
    >
      <FontAwesomeIcon size={'sm'} className={withGrayAccentColor} icon={faTimes} />
    </button>
  );
};
export default ButtonClose;
