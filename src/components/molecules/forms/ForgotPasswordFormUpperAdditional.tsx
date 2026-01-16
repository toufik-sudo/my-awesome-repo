import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/components/LoginModal.module.scss';

/**
 * Molecule component used to render upper additional forgot password
 *
 * @param closeModal
 * @constructor
 */
const ForgotPasswordFormUpperAdditional = ({ closeModal }) => {
  const { closeBtn, closeBtnWrapper } = style;

  return (
    <div className={closeBtnWrapper}>
      <DynamicFormattedMessage tag="span" id="form.title.forgotPassword" />
      <button onClick={closeModal} className={closeBtn}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default memo(ForgotPasswordFormUpperAdditional);
