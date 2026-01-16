import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import { emptyFn } from 'utils/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import style from 'assets/style/common/Button.module.scss';

/**
 * Button atom used to render flexible button with icon
 *
 * @param children
 * @param onClick
 * @param type
 * @param variant
 * @param disabled
 * @param role
 * @param className
 * @constructor
 *
 */
const ButtonWithIcon = ({
  children,
  onClick = emptyFn,
  type = BUTTON_MAIN_TYPE.PRIMARY,
  variant = '',
  disabled = false,
  role = 'button' as any,
  className = ''
}) => {
  const { withIcon, iconWrapper } = style;

  return (
    <button {...{ onClick, disabled }} type={role} className={`${withIcon} ${style[`${type}${variant}`]} ${className}`}>
      <span className={iconWrapper}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </span>
      {children}
    </button>
  );
};

export default ButtonWithIcon;
