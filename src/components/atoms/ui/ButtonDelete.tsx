import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { BUTTON } from 'constants/general';

/**
 * Atom component used to render a delete button
 *
 * @param onclick
 * @param className
 * @constructor
 *
 * @see ButtonStory
 */
const ButtonDelete = ({ onclick, className = '' }) => (
  <button type={BUTTON} className={className} onClick={onclick} tabIndex={-1}>
    <FontAwesomeIcon icon={faTrashAlt} />
  </button>
);

export default ButtonDelete;
