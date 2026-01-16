import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { emptyFn } from 'utils/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import style from 'assets/style/common/Button.module.scss';

/**
 * Button atom used to render flexible button
 *
 * @param children
 * @param onClick
 * @param type
 * @param variant
 * @param disabled
 * @param role
 * @param loading
 * @param className
 * @param isAvatarStep
 * @constructor
 *
 * @see ButtonStory
 */
const Button = ({
  children,
  onClick = emptyFn,
  type = BUTTON_MAIN_TYPE.PRIMARY,
  variant = '',
  disabled = false,
  role = 'button' as any,
  loading = false,
  className = '',
  customStyle = {}
}) => {
  const { btn } = style;
  const onEnabledCLick = () => !disabled && onClick();

  return (
    <button
      {...{ onClick: onEnabledCLick, disabled }}
      style={customStyle}
      type={role}
      className={`${btn} ${style[`${type}${variant}`]} ${className}`}
    >
      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : children}
    </button>
  );
};

export default Button;
