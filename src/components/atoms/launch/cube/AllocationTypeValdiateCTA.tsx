import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Atom component used to render validate cta on allocation type form
 *
 * @param targetValue
 * @constructor
 */
const AllocationTypeValidateCTA = ({ targetValue }) => {
  const { cubeValidateButton, cubeValidateButtonSelected } = style;

  return (
    <div className={`${cubeValidateButton} ${targetValue ? cubeValidateButtonSelected : ''}`}>
      <span>
        <button type="submit">
          <FontAwesomeIcon icon={targetValue ? faEdit : faCheck} />
          <DynamicFormattedMessage
            tag={HTML_TAGS.SPAN}
            id={`launchProgram.cube.${targetValue ? 'modify' : 'validate'}`}
          />
        </button>
      </span>
    </div>
  );
};

export default AllocationTypeValidateCTA;
