import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import style from 'sass-boilerplate/stylesheets/components/wall/PostComments.module.scss';

/**
 * Atom component used to show comment spinner
 * @constructor
 */
const CommentsSpinner = () => {
  return (
    <div className={style.commentsSpinner}>
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  );
};

export default CommentsSpinner;
