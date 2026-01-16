import React, { createContext, FC } from 'react';

import StaticPricingRow from 'components/molecules/landing/StaticPricingRow';
import { PRICING_BLOCK_TYPES } from 'constants/landing';
import { IPricingPlansBlockProps } from 'interfaces/components/sections/IPricingPlansBlock';

import style from 'assets/style/components/Pricing/StaticPricing.module.scss';

export const PricingContext = createContext({});

/**
 * Molecule component used to render a pricing data section (labels + slider)
 *
 * @param pricingData
 * @param columnIndex
 * @param type
 * @constructor
 */
const StaticPricingPlan: FC<IPricingPlansBlockProps> = ({
  pricingData,
  columnIndex,
  type = PRICING_BLOCK_TYPES.BASE
}) => {
  return (
    <PricingContext.Provider value={type}>
      <div className={`${style.staticSubscriptionWrapper} ${style[type]}`} id={type}>
        <StaticPricingRow pricingElement={pricingData} columnIndex={columnIndex} translationPrefix="payment.setup." />
      </div>
    </PricingContext.Provider>
  );
};

export default StaticPricingPlan;
