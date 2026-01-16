import React from 'react';

import PricingPlans from 'components/organisms/landing/PricingPlans';
import Loading from 'components/atoms/ui/Loading';
import FrequencyOfPaymentList from 'components/organisms/onboarding/FrequencyOfPaymentList';
import { LOADER_TYPE } from 'constants/general';
import { PRICING_BLOCK_TYPES } from 'constants/landing';
import { useSubscriptionData } from 'hooks/useSubscriptionData';
import layoutStyle from 'assets/style/components/LeftSideLayout.module.scss';
import pricingStyle from 'assets/style/components/Pricing/Pricing.module.scss';
import style from 'assets/style/components/Subscription.module.scss';

/**
 * Molecule component used to render subscription section
 *
 * @constructor
 */
const SubscriptionSection = () => {
  const { isLoading, initialSlide, pricingData, setActiveSlide } = useSubscriptionData();

  if (isLoading) return <Loading type={LOADER_TYPE.PAGE} />;

  if (initialSlide === false) return null;

  return (
    <div className={`${style.subscriptionContainer} ${layoutStyle.basicContainer} ${pricingStyle.singularSlider}`}>
      <PricingPlans
        {...{ pricingData, initialSlide }}
        type={PRICING_BLOCK_TYPES.SUBSCRIPTION}
        setActiveSlide={setActiveSlide}
      />
      <FrequencyOfPaymentList {...{ initialSlide, pricingData }} />
    </div>
  );
};

export default SubscriptionSection;
