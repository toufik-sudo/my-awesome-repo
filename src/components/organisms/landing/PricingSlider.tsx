import React from 'react';
import Slider from 'react-slick';

import PricingColumn from 'components/molecules/landing/PricingColumn';
import { PRICING_CONFIG } from 'constants/landing';
import { changeProgramType } from 'utils/general';
import style from 'assets/style/components/Pricing/Pricing.module.scss';

/**
 * Organism component used to render pricing slider
 *
 * @param type
 * @param setActiveSlide
 * @param pricingData
 * @param initialSlide
 * @constructor
 */
const PricingSlider = ({ type, setActiveSlide, pricingData, initialSlide }) => {
  return (
    <Slider
      {...{ ...PRICING_CONFIG[type].sliderSettings, initialSlide }}
      className={style.pricingSlider}
      afterChange={position => changeProgramType(setActiveSlide, position, pricingData)}
    >
      {PricingColumn(pricingData)}
    </Slider>
  );
};

export default PricingSlider;
