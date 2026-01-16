import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import ResultsValidationFieldBlockElement from './ResultsValidationFieldBlockElement';
import { processTranslations } from 'services/UsersServices';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useMultiStep } from 'hooks/launch/useMultiStep';

import style from 'assets/style/components/launch/UserValidation.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render Results Validation fields map
 *
 * @constructor
 */
const ResultsValidationFieldBlock = () => {
  const { messages } = useIntl();
  const labels = useMemo(
    () => processTranslations(messages, 'launchProgram.users.resultsValidationStep', '.accept', '.decline'),
    [messages]
  );

  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  return (
    <div className={style.validationWrapper}>
      {labels.map((label, index) => (
        <ResultsValidationFieldBlockElement {...{ label, index }} key={index} />
      ))}
      <div className={coreStyle.btnCenter}>
        <DynamicFormattedMessage tag={Button} onClick={() => setNextStep()} id="form.submit.next" />
      </div>
    </div>
  );
};

export default ResultsValidationFieldBlock;
