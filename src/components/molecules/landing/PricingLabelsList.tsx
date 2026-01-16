import React, { memo } from 'react';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { DELAY_TYPES } from 'constants/animations';
import { PRICING_CONFIG, PRICING_TYPES } from 'constants/landing';
import { setScale } from 'utils/animations';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/components/Pricing/Pricing.module.scss';

/**
 * Molecule component for labels list
 *
 * @param type
 * @constructor
 */
const PricingLabelsList = ({ type }) => (
  <SpringAnimation settings={setScale(DELAY_TYPES.NONE)} className={`${style.labelsBlock} ${type}`}>
    <ul>
      {PRICING_TYPES[type].map(label => {
        if (PRICING_CONFIG[type].excludeBlock.includes(label)) return null;

        return <DynamicFormattedMessage key={label} tag="li" id={`label.price.${label}`} />;
      })}
    </ul>
  </SpringAnimation>
);

export default memo(PricingLabelsList);
