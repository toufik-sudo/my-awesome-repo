import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { INPUT_TYPE } from 'constants/forms';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';

/**
 * Component used to render user program role options
 * @param isPeopleManager
 * @param setIsPeopleManager
 * @constructor
 */
const ProgramRoleOptions = ({ isPeopleManager, setIsPeopleManager }) => {
  const {
    withBoldFont,
    displayFlex,
    mb2,
    px15,
    px2,
    pb4,
    flexDirectionColumn,
    flexAlignItemsCenter,
    flexSpace1,
    w100,
    withBackgroundPrimary,
    withDefaultColor,
    borderRadius1,
    textLg,
    mLargePx0,
    mLargeTextMd,
    mLargePb3,
    pt15
  } = coreStyle;
  const { customRadioInputWrapper, customRadioInput } = inputStyle;

  return (
    <div className={`${displayFlex} ${mLargePx0} ${w100} ${coreStyle['flex-direction-row']} ${px2} ${mb2}`}>
      <div
        className={`${withBoldFont} ${borderRadius1} ${mLargePb3} ${displayFlex} ${flexAlignItemsCenter} ${flexDirectionColumn} ${flexSpace1} ${pt15} ${px15} ${pb4} ${
          isPeopleManager ? withBackgroundPrimary : ''
        }`}
      >
        <DynamicFormattedMessage
          className={`${mb2} ${textLg} ${mLargeTextMd} ${isPeopleManager ? withDefaultColor : ''}`}
          tag={HTML_TAGS.P}
          id="wall.user.program.role.manager"
        />
        <label htmlFor="manager" className={customRadioInputWrapper}>
          <input
            type={INPUT_TYPE.RADIO}
            name="isPeopleManager"
            checked={isPeopleManager}
            onChange={() => setIsPeopleManager(true)}
            id="manager"
          />
          <div className={customRadioInput} />
        </label>
      </div>
      <div
        className={`${withBoldFont} ${borderRadius1} ${mLargePb3} ${displayFlex} ${flexAlignItemsCenter} ${flexDirectionColumn} ${flexSpace1} ${pt15} ${px15} ${pb4} ${
          !isPeopleManager ? withBackgroundPrimary : ''
        }`}
      >
        <DynamicFormattedMessage
          className={`${mb2} ${textLg} ${!isPeopleManager ? withDefaultColor : ''}`}
          tag={HTML_TAGS.P}
          id="wall.user.program.role.user"
        />
        <label htmlFor="user" className={customRadioInputWrapper}>
          <input
            type={INPUT_TYPE.RADIO}
            name="isPeopleManager"
            checked={!isPeopleManager}
            onChange={() => setIsPeopleManager(false)}
            id="user"
          />
          <div className={customRadioInput} />
        </label>
      </div>
    </div>
  );
};

export default ProgramRoleOptions;
