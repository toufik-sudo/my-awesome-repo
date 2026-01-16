import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import { useMultiStep } from 'hooks/launch/useMultiStep';

import style from 'assets/style/components/launch/ProgressBar.module.scss';

/**
 * Molecule component used to render multi step buttons
 *
 * @constructor
 */
const MultiStepButtons = () => {
  const {
    handleBackStep,
    stepAvailable: { prevAvailable }
  } = useMultiStep();
  const { submitButtonsContainer, submitButtonsWrapper } = style;

  return (
    <div className={submitButtonsContainer} style={{bottom: '20px'}}>
      <div className={submitButtonsWrapper}>
        {prevAvailable && <FontAwesomeIcon onClick={handleBackStep} icon={faUndoAlt} />}
      </div>
    </div>
  );
};

export default MultiStepButtons;
