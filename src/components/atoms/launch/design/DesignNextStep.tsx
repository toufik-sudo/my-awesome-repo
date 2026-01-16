import React from 'react';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

/**
 * Atom component used to render next step btn for design
 *
 * @param allDataValid
 * @param handleNextStep
 * @param isLoading
 * @constructor
 */
const DesignNextStep = ({ allDataValid, handleNextStep, isLoading, className = '' }) => {
  const intl = useIntl();

  return (
    <Button
      onClick={handleNextStep}
      type={allDataValid ? BUTTON_MAIN_TYPE.PRIMARY : BUTTON_MAIN_TYPE.DISABLED}
      disabled={!allDataValid || isLoading}
      className={className}
    >
      {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : intl.formatMessage({ id: 'form.submit.next' })}
    </Button>
  );
};

export default DesignNextStep;
