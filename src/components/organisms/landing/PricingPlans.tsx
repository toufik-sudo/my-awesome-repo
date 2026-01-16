import React, { createContext, FC } from 'react';

import PricingSlider from 'components/organisms/landing/PricingSlider';
import PricingLabelsList from 'components/molecules/landing/PricingLabelsList';
import { INITIAL_SLIDE, PRICING_BLOCK_TYPES, PRICING_CONFIG } from 'constants/landing';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { IPricingPlansBlockProps } from 'interfaces/components/sections/IPricingPlansBlock';
import style from 'assets/style/components/Pricing/Pricing.module.scss';

export const PricingContext = createContext({});

/**
 * Molecule component used to render a pricing data section (labels + slider)
 *
 * @param pricingData
 * @param type
 * @param activePlan
 * @constructor
 */
const PricingPlans: FC<IPricingPlansBlockProps> = ({
  pricingData,
  type = PRICING_BLOCK_TYPES.BASE,
  initialSlide = INITIAL_SLIDE,
  setActiveSlide
}) => {
  const { wrapper, title } = style;

  return (
    <PricingContext.Provider value={type}>
      <div className={`${wrapper} ${style[type]}`} id={type}>
        <DynamicFormattedMessage tag="div" className={`${title} primary`} id={PRICING_CONFIG[type].title} />
        <PricingLabelsList type={type} />
        <PricingSlider {...{ initialSlide, pricingData, setActiveSlide, type }} />
      </div>
    </PricingContext.Provider>
  );
};

export default PricingPlans;
