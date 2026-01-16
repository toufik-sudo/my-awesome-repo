import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { BUTTON, HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import settingsStyle from 'sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss';

/**
 * Atom component used to render a delete button with a message id
 *
 * @param onclick
 * @param msgId
 * @constructor
 *
 * @see ButtonStory
 */
const ButtonDeleteWithMessage = ({ onclick, msgId }) => {
  return (
    <button type={BUTTON} onClick={onclick}>
      <FontAwesomeIcon icon={faTrashAlt} />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={msgId} className={settingsStyle.btnDelete} />
    </button>
  );
};

export default ButtonDeleteWithMessage;
