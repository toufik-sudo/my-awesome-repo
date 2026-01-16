import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import { emptyFn } from 'utils/general';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Atom component used to render a formatted message button
 *
 * @param onClick
 * @param buttonText
 * @param type
 * @param variant
 * @param className
 * @param role
 * @param isLoading
 * @param disabled
 * @constructor
 *
 * @see ButtonStory
 */
const ButtonFormatted = ({
  onClick = emptyFn,
  buttonText,
  type,
  variant = '',
  className = '',
  isLoading = false,
  role = 'button',
  disabled = false
}) => (
  <Button {...{ onClick, type, variant, className, role, disabled }}>
    {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FormattedMessage id={buttonText} />}
  </Button>
);

export default ButtonFormatted;
