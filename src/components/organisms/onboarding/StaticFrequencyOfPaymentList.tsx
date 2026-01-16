import React from 'react';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render Frequency plan block
 *
 * @constructor
 */
const StaticFrequencyOfPaymentList = () => {
  const {
    withPrimaryColorAccent,
    withDefaultTextColor,
    textSm,
    textTiny,
    mb2,
    mb0,
    fontWeight700,
    withShadowTight,
    p35,
    borderRadius1,
    ml15,
    flexSpace1
  } = coreStyle;

  return (
    <div
      className={`${withShadowTight} ${borderRadius1} ${flexSpace1} ${ml15} ${p35} ${coreStyle['flex-center-total']} ${coreStyle['flex-direction-column']}`}
    >
      <p className={`${withPrimaryColorAccent} ${fontWeight700} ${mb0} ${textSm}`}>Annual payment</p>
      <p className={`${withPrimaryColorAccent} ${fontWeight700} ${mb2} ${textSm}`}>50€/month</p>
      <p className={`${withDefaultTextColor} ${mb0} ${textTiny} ${fontWeight700}`}>One payment: 600€ / year</p>
      <p className={`${withDefaultTextColor}`}>-20% from regular price</p>
    </div>
  );
};

export default StaticFrequencyOfPaymentList;
