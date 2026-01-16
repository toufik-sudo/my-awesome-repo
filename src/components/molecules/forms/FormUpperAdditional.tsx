import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import basicStyle from 'assets/style/components/Modals/Modal.module.scss';
import style from 'assets/style/components/LoginModal.module.scss';

/**
 * Molecule component used to render form upper additional
 *
 * @constructor
 */
const FormUpperAdditional = ({ closeModal }) => {
  const { closeBtn, closeBtnWrapper } = style;

  return (
    <div className={closeBtnWrapper}>
      <button onClick={closeModal} className={`${basicStyle.closeBtn} ${closeBtn}`}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default memo(FormUpperAdditional);
