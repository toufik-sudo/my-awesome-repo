import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/components/launch/UserListErrorDisplay.module.scss';

/**
 * Atom component used to render error list title
 *
 * @param invalidRecordsLength
 * @constructor
 *
 * @see ErrorStory
 */
const ErrorListTitle = ({ invalidRecordsLength }) => (
  <DynamicFormattedMessage
    tag="h3"
    className={style.errorsDisplayTitle}
    id="launchProgram.users.download.errors.title"
    values={{ number: invalidRecordsLength }}
  />
);

export default ErrorListTitle;
