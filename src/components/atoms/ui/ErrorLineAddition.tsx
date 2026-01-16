import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';

import { isMobile } from 'utils/general';

/**
 * Atom component used to display error message
 *
 * @param code
 * @constructor
 */
const ErrorLineAddition = ({ code }) => {
  const intl = useIntl();
  const error = intl.formatMessage({ id: `launch.error.info.${code}` });
  let output = <FontAwesomeIcon data-tip={error} icon={faInfoCircle} />;

  if (isMobile()) {
    output = <p>{error}</p>;
  }

  return output;
};

export default ErrorLineAddition;
