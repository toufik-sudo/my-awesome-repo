import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Button from 'components/atoms/ui/Button';
import { ISubmitFormButton } from 'interfaces/components/common/IButton';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { BUTTON_TYPES } from 'constants/stories';

import buttonStyle from 'assets/style/common/Button.module.scss';

/**
 *  Atom component used to render submit register form
 * @param isSubmitting
 * @param isValid
 * @param onClick
 * @constructor
 */

const ButtonForward: FC<ISubmitFormButton> = ({ isSubmitting, loading, type, onClick, nextStepDisabled }) => {
  let iconComponent = <FontAwesomeIcon icon={faSpinner} spin />;

  if (!loading) {
    iconComponent = <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="form.submit.next" />;
  }

  return (
    <Button
      {...{ type }}
      disabled={isSubmitting || nextStepDisabled}
      className={nextStepDisabled ? buttonStyle.disabled : ''}
      role={BUTTON_TYPES.SUBMIT_FORM}
      onClick={onClick}
    >
      {iconComponent}
    </Button>
  );
};

export default memo(ButtonForward);
