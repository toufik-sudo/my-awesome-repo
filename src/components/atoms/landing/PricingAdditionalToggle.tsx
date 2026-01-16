import React from 'react';

import Button from 'components/atoms/ui/Button';
import { HIDE } from 'constants/landing';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import style from 'assets/style/components/Pricing/Pricing.module.scss';

/**
 * Atom component used to render toggle that toggles additional pricing info
 *
 * @param toggleAdditionalPricing
 * @param additionalVisible
 * @constructor
 *
 * @see PricingAdditionalToggleStory
 */
const PricingAdditionalToggle = ({ toggleAdditionalPricing, additionalVisible }) => {
  const { additionalOptions, additionalBtnWrapper } = style;

  return (
    <div className={additionalBtnWrapper}>
      <DynamicFormattedMessage
        type={BUTTON_MAIN_TYPE.TEXT_ONLY}
        tag={Button}
        id={`additional.options${additionalVisible ? `.${HIDE}` : ''}`}
        onClick={() => toggleAdditionalPricing()}
        className={additionalOptions}
      />
    </div>
  );
};

export default PricingAdditionalToggle;
