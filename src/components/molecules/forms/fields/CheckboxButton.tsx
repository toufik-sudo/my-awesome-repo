import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { RESULTS_CHANNEL_FIELDS, RESULTS_CHANNEL } from 'constants/wall/launch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { DOT_SEPARATOR } from 'constants/general';
import { INPUT_TYPE } from 'constants/forms';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/common/Checkbox.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used for a checkbok element
 *
 * @param label
 * @param index
 * @param resultChannel
 * @constructor
 */
export const CheckboxButton = ({ label, index, resultChannel }) => {
  const { checkboxInfo, checkboxLabel, noCheckbox } = style;
  const dispatch = useDispatch();
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  let checkboxValue: any = false;
  if (launchStore.resultChannel) {
    checkboxValue = Object.values(launchStore.resultChannel)[index];
  }
  if (index === 2) {
    checkboxValue = false;
  }
  const handleCheckboxUpdate = () => {
    const labelArray = label.split(DOT_SEPARATOR);
    const labelName = labelArray[labelArray.length - 1];
    const updatedData = { ...resultChannel, [labelName]: !resultChannel[labelName] };
    dispatch(setLaunchDataStep({ key: RESULTS_CHANNEL, value: updatedData }));
  };

  return (
    <>
      <label>
        <input
          className={index === 2 ? noCheckbox : coreStyle.mr05}
          name={`check-${RESULTS_CHANNEL_FIELDS[index]}`}
          type={INPUT_TYPE.CHECKBOX}
          checked={checkboxValue}
          onChange={handleCheckboxUpdate}
        />
        <DynamicFormattedMessage tag="span" id={label} className={checkboxLabel} />
      </label>
      <DynamicFormattedMessage tag="div" id={`${label}.info`} className={checkboxInfo} />
    </>
  );
};
