import React from 'react';

import UserProgramStatus from 'components/atoms/wall/users/UserProgramStatus';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { INPUT_TYPE } from 'constants/forms';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/UserRowElement.module.scss';
import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';

/**
 * Component used to render managed user row
 * @param user
 * @param index
 * @param setManagedStatus
 * @param isValidating
 * @constructor
 */
const ManageUserRow = ({
  user: { id, firstName, lastName, status, isManaged = false, error = undefined },
  index,
  setManagedStatus,
  isValidating
}) => {
  const {
    flexSpace1,
    w100,
    displayFlex,
    mb15,
    ml3,
    flexAlignItemsCenter,
    flexJustifyContentCenter,
    textLeft,
    flexAlignItemsStart,
    pr05
  } = coreStyle;
  const { customRadioInputWrapper, customRadioInput } = inputStyle;

  return (
    <li className={`${mb15} ${textLeft}`}>
      <div className={`${displayFlex} ${flexAlignItemsStart} ${w100} ${coreStyle['flex-direction-row']}`}>
        <label
          htmlFor={`user${id}`}
          className={`${customRadioInputWrapper} ${flexAlignItemsCenter} ${flexJustifyContentCenter} ${displayFlex} ${flexSpace1} ${pr05}`}
        >
          <input
            type={INPUT_TYPE.CHECKBOX}
            checked={isManaged}
            disabled={isValidating}
            onChange={e => setManagedStatus(index, id, e.target.checked)}
            id={`user${id}`}
          />
          <div className={`${customRadioInput} ${ml3}`} />
        </label>
        <p className={`${flexSpace1} ${pr05}`}>{firstName}</p>
        <p className={`${flexSpace1} ${pr05}`}>{lastName}</p>
        <div className={`${flexSpace1} ${pr05}`}>
          <UserProgramStatus {...{ userId: id, status, onProgramOnly: true, style }} />
        </div>
      </div>
      <DynamicFormattedError id={error} hasError={!!error} />
    </li>
  );
};
export default ManageUserRow;
