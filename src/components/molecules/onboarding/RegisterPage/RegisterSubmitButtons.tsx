import React from 'react';

import ButtonForward from 'components/atoms/ui/ButtonForward';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';

/**
 * Component used to render register form onBack and onSubmit buttons
 * @param onBack
 * @param isLastStep
 * @param isLoading
 * @param isSubmitting
 * @constructor
 */
const RegisterSubmitButtons = ({
  onBack,
  disableForward = false,
  isLoading,
  isSubmitting,
  onSubmitAvatar = emptyFn
}) => {
  return (
    <div className={`${coreStyle['flex-space-between']} ${coreStyle.pt2}`}>
      <DynamicFormattedMessage
        tag={Button}
        id="form.label.back"
        onClick={() => onBack()}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
      />
      <ButtonForward
        nextStepDisabled={disableForward}
        isSubmitting={isSubmitting}
        buttonText="form.submit.validate"
        loading={isLoading}
        onClick={onSubmitAvatar}
      />
    </div>
  );
};

export default RegisterSubmitButtons;
