import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import { ISubmitFormButton } from 'interfaces/components/common/IButton';

/**
 * Atom component used to render submit form button
 *
 * @param isSubmitting
 * @param buttonText
 * @param loading
 * @param className
 * @param nextStepDisabled
 * @param type
 * @param variant
 * @param onClick
 * @constructor
 *
 * @see ButtonStory
 */
const ButtonSubmitForm: FC<ISubmitFormButton> = ({
  isSubmitting,
  buttonText,
  loading,
  className,
  nextStepDisabled,
  type,
  variant,
  onClick,
  customStyle
}) => {
  const intl = useIntl();

  return (
    <Button
      {...{ type, className }}
      disabled={isSubmitting || loading || nextStepDisabled}
      role="submit"
      loading={loading}
      variant={variant}
      onClick={onClick}
      customStyle={customStyle}
    >
      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : intl.formatMessage({ id: buttonText })}
    </Button>
  );
};

export default memo(ButtonSubmitForm);
