import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/Inputs.module.scss';

/**
 * Renders a list of requirements for field validation
 * @param value
 * @param text
 * @param key
 * @constructor
 */
const FieldStrengthRequirements = ({ value, text, key }) => {
  const { toolTipError, toolTipErrorMessage, toolTipSuccess } = componentStyle;
  return (
    <li key={key} className={`${toolTipErrorMessage} ${toolTipError} ${value ? toolTipSuccess : ''}`}>
      <FontAwesomeIcon icon={value ? faCheck : faTimes} />
      <DynamicFormattedMessage tag="span" id={text} />
    </li>
  );
};

export default FieldStrengthRequirements;
