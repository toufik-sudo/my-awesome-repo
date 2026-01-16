import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Atom component used to render validate cta
 *
 * @param targetName
 * @param targetValue
 * @param handleItemValidation
 * @constructor
 */
const ValidateCta = ({ targetName = '', targetValue, handleItemValidation }) => (
  <div className={`${style.cubeValidateButton} ${targetValue ? style.cubeValidateButtonSelected : ''}`}>
    <span onClick={() => handleItemValidation(targetName)}>
      <FontAwesomeIcon icon={targetValue ? faEdit : faCheck} />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={`launchProgram.cube.${targetValue ? 'modify' : 'validate'}`} />
    </span>
  </div>
);

export default ValidateCta;
