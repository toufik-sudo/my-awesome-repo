import React from 'react';
import { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

/**
 * Atom component used to show dropdown indicators option for post.
 * @param props
 * @constructor
 */
const DropdownIndicators = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <FontAwesomeIcon icon={props.selectProps.menuIsOpen ? faCaretDown : faCaretUp} />
      </components.DropdownIndicator>
    )
  );
};

export default DropdownIndicators;
