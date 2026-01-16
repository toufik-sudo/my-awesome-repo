import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from 'assets/style/components/Loading.module.scss';

/**
 * Atom component that renders a loading spinner
 *
 * @constructor
 *
 * NOTE: story available (see readme)
 */
const Loading = ({ type, className = '' }) => (
  <div className={style[type]}>
    <FontAwesomeIcon icon={faSpinner} spin className={className} />
  </div>
);

export default Loading;
