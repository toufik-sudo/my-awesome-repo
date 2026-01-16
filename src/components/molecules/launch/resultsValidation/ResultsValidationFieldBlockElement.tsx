import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ResultsValidationRadio from './ResultsValidationRadio';
import { RADIO_OPTIONS, DECLINE, ACCEPT, ACCEPT_FIELD, DECLINE_FIELD } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { RESULTS_VALIDATION_FIELDS, USER_VALIDATION_FIELDS } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/launch/UserValidation.module.scss';

/**
 * Molecule component used to render Results Validation Blocks
 *
 * @constructor
 */
const ResultsValidationFieldBlockElement = ({ label, index }) => {
  const { validationBlock, validationLabel, validationRadioWrapper } = style;
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const validationState = launchStore[RESULTS_VALIDATION_FIELDS[index]] ? ACCEPT : DECLINE;
  const [value, setValue] = useState(`${validationState}-${RESULTS_VALIDATION_FIELDS[index]}`);
  const resultsFieldValue = value.split('-')[1];
  const rewardsFieldValue = !launchStore[resultsFieldValue] ? DECLINE_FIELD : ACCEPT_FIELD;

  return (
    <div className={`${validationBlock} ${style[USER_VALIDATION_FIELDS[index]]}`}>
      <DynamicFormattedMessage className={validationLabel} tag="div" id={label} />
      <div className={validationRadioWrapper}>
        {RADIO_OPTIONS.map((option, i) => (
          <ResultsValidationRadio
            key={option}
            {...{ index, label, value, setValue, rewardsFieldValue }}
            textId={`form.label.radio.${option}`}
            textLabel={option}
            blockItemNumber={index}
            elementItemNumber={i}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsValidationFieldBlockElement;
