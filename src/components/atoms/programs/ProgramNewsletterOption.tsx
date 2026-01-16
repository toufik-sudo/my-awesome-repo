import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { INPUT_TYPE } from 'constants/forms';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';

/**
 * Component that renders program newsletter option
 * @param labelId
 * @param isSelected
 * @param onChange
 * @constructor
 */
const ProgramNewsletterOption = ({ labelId, isSelected, onChange }) => {
  const { displayFlex, px15, pb4, borderRadius1, pt15, ml1 } = coreStyle;
  const { customRadioInputWrapper, customRadioInput } = inputStyle;

  return (
    <div className={`${borderRadius1} ${displayFlex} ${coreStyle['flex-direction-row']} ${pt15} ${px15} ${pb4}`}>
      <label htmlFor={`newsletter_${isSelected}`} className={customRadioInputWrapper}>
        <input
          type={INPUT_TYPE.RADIO}
          name="newsletter"
          checked={isSelected}
          onChange={onChange}
          id={`newsletter_${isSelected}`}
        />
        <div className={customRadioInput} />
      </label>
      <DynamicFormattedMessage tag={HTML_TAGS.P} id={labelId} className={ml1} />
    </div>
  );
};
export default ProgramNewsletterOption;
