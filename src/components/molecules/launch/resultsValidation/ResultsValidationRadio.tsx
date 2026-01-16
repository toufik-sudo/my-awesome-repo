import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ACCEPT, DECLINE, DOT_SEPARATOR } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { RESULTS_VALIDATION_FIELDS } from 'constants/wall/launch';
import { useResultsValidation } from 'hooks/launch/resultsInformation/useResultsValidation';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { IStore } from 'interfaces/store/IStore';
import { INPUT_TYPE } from 'constants/forms';

import style from 'assets/style/components/launch/UserValidation.module.scss';

/**
 * Molecule component used to render Results Validation Blocks Radio buttons
 *
 * @constructor
 */
const ResultsValidationRadio = ({
  index,
  textId,
  label,
  textLabel,
  setValue,
  blockItemNumber,
  elementItemNumber,
  rewardsFieldValue
}) => {
  const { validationRadioBlock, validationRadioBlockLabel, validationExtraInfo, validationRadioBlockDisabled } = style;
  const { currentValidationForm, handleValidationUpdate } = useResultsValidation(textLabel, index, setValue);
  const { personaliseProducts } = useSelector((store: IStore) => store.launchReducer);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!personaliseProducts) {
  //     dispatch(setLaunchDataStep({ key: RESULTS_VALIDATION_FIELDS[index], value: !personaliseProducts }));
  //   }
  // }, []);
  let checkedValue = false;
  if (label == "launchProgram.users.resultsValidationStep2") {
    checkedValue = textLabel == DECLINE;
  } else {
    checkedValue = currentValidationForm.split('-')[0] === rewardsFieldValue;
  }

  return (
    <div className={`${validationRadioBlock}`} >
      <input
        id={`check-${blockItemNumber}-${elementItemNumber}`}
        name={`check-${RESULTS_VALIDATION_FIELDS[index]}`}
        type={INPUT_TYPE.RADIO}
        checked={checkedValue}
        onChange={handleValidationUpdate}
        disabled={label == "launchProgram.users.resultsValidationStep2" && textLabel == ACCEPT}
      />
      <DynamicFormattedMessage
        tag="label"
        className={validationRadioBlockLabel}
        htmlFor={`check-${blockItemNumber}-${elementItemNumber}`}
        id={textId}
      />
      <DynamicFormattedMessage tag="div" className={validationExtraInfo} id={`${label}${DOT_SEPARATOR}${textLabel}`} />
    </div>
  );
};

export default ResultsValidationRadio;
