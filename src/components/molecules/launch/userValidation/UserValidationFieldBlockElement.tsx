import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import UserValidationRadio from 'components/molecules/launch/userValidation/UserValidationRadio';
import { RADIO_OPTIONS, DECLINE, ACCEPT } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { USER_VALIDATION_FIELDS } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/launch/UserValidation.module.scss';

/**
 * Molecule component used to render User Validation Blocks
 *
 * @constructor
 */
const UserValidationFieldBlockElement = ({ label, index }) => {
  const { validationBlock, validationLabel, validationRadioWrapper } = style;
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const validationState = launchStore[USER_VALIDATION_FIELDS[index]] ? ACCEPT : DECLINE;
  const [value, setValue] = useState(`${validationState}-${USER_VALIDATION_FIELDS[index]}`);

  return (
    <div className={`${validationBlock} ${style[USER_VALIDATION_FIELDS[index]]}`}>
      <DynamicFormattedMessage className={validationLabel} tag="div" id={label} />
      <div className={validationRadioWrapper}>
        {RADIO_OPTIONS.map((option, i) => (
          <UserValidationRadio
            key={option}
            {...{ index, label, value, setValue }}
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

export default UserValidationFieldBlockElement;
