import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { INPUT_TYPE } from 'constants/forms';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';

/**
 * Component used to render managed users list header
 * @param allManaged
 * @param setAllManagedStatus
 * @param isValidating
 * @constructor
 */
const ManageUsersHeader = ({ allManaged, setAllManagedStatus, isValidating }) => {
  const {
    displayFlex,
    flexSpace1,
    w100,
    flexAlignItemsCenter,
    flexJustifyContentCenter,
    mr15,
    mb2,
    textLeft
  } = coreStyle;
  const { customRadioInputWrapper, customRadioInput, customRadioInputSquare } = inputStyle;

  const usersLabel = 'wall.users.';

  return (
    <ul className={`${displayFlex} ${textLeft} ${mb2} ${w100} ${coreStyle['flex-direction-row']}`}>
      <li className={`${displayFlex} ${flexSpace1} ${flexAlignItemsCenter} ${flexJustifyContentCenter}`}>
        <DynamicFormattedMessage className={mr15} id="label.all" tag={HTML_TAGS.SPAN} />
        <label htmlFor="select-all-people-managers" className={customRadioInputWrapper}>
          <input
            type={INPUT_TYPE.CHECKBOX}
            value={allManaged}
            checked={allManaged}
            disabled={isValidating}
            onChange={e => setAllManagedStatus(e.target.checked)}
            id="select-all-people-managers"
          />
          <div className={`${customRadioInput} ${customRadioInputSquare}`} />
        </label>
      </li>
      <DynamicFormattedMessage className={flexSpace1} tag={HTML_TAGS.LI} id={`${usersLabel}firstName`} />
      <DynamicFormattedMessage className={flexSpace1} tag={HTML_TAGS.LI} id={`${usersLabel}name`} />
      <DynamicFormattedMessage className={flexSpace1} tag={HTML_TAGS.LI} id={`${usersLabel}status`} />
    </ul>
  );
};

export default ManageUsersHeader;
