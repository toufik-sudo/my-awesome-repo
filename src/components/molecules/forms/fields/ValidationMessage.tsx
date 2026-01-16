import React from 'react';
import { FormattedMessage } from 'react-intl';

/**
 * Template component that outputs a formatted intl validation message
 * Maps an array of extra constraints and outputs those errors if they are being set onSubmit
 *
 * @param errors
 * @param touched
 * @param label
 * @param extraConstraints
 * @constructor
 */
export const ValidationMessage = ({ errors, touched, label, extraConstraints = undefined }) => {
  let validationMessage = errors[label] && touched[label] && errors[label];

  if (!validationMessage && extraConstraints && extraConstraints.length) {
    const extraValidation = extraConstraints.find(extra => !!errors[extra]) || null;
    return extraValidation && <FormattedMessage id={`form.validation.${label}.${extraValidation}`} />;
  }

  if (!validationMessage) {
    return null;
  }

  // Check if the value of error message is object and add the value to the root of the object
  validationMessage = validationMessage.value || validationMessage;

  if (errors && errors.oldPassword === 1001) {
    return <FormattedMessage id={`form.validation.old.password`} />;
  }

  return <FormattedMessage id={`form.validation.${validationMessage}`} />;
};
