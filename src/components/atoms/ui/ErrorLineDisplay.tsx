import React from 'react';

import ErrorLineAddition from 'components/atoms/ui/ErrorLineAddition';
import style from 'assets/style/components/launch/UserListErrorDisplay.module.scss';

/**
 * Atom component used to display a line error
 *
 * @param invalidEmail
 * @constructor
 *
 * @see ErrorStory
 */
const ErrorLineDisplay = ({ email, code }) => {
  return (
    <li className={style.errorsDisplayContent}>
      {email}
      <ErrorLineAddition {...{ code }} />
    </li>
  );
};

export default ErrorLineDisplay;
