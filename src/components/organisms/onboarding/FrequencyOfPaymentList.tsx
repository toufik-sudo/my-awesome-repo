import React from 'react';

import FrequencyPlanBlock from 'components/molecules/onboarding/FrequencyPlanBlock';
import { FREQUENCIES_OF_PAYMENT } from 'constants/landing';
import { getCurrentFrequenciesOfPayment } from 'services/PricingPlanServices';
import style from 'assets/style/components/Subscription.module.scss';

/**
 * Organism component used to render Frequency plan block
 *
 * @param initialSlide
 * @param pricingData
 * @constructor
 */
const FrequencyOfPaymentList = ({ initialSlide, pricingData }) => {
  const frequencyData = getCurrentFrequenciesOfPayment(initialSlide, pricingData, FREQUENCIES_OF_PAYMENT);

  if (!frequencyData || !frequencyData.length) return null;

  return (
    <div className={style.freqOfPaymentWrapper}>
      {frequencyData.map(plan => (
        <FrequencyPlanBlock {...{ plan }} key={plan.id} />
      ))}
    </div>
  );
};

export default FrequencyOfPaymentList;
