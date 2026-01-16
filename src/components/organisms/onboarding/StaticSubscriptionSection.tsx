import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import FreemiumPaymentBlock from 'components/molecules/wall/settings/FreemiumPaymentBlock';
import StaticPricingPlan from 'components/organisms/landing/StaticPricingPlan';
import UpgradePan from 'components/molecules/landing/UpgradePan';
import FrequencyPlanBlock from 'components/molecules/onboarding/FrequencyPlanBlock';
import { LOADER_TYPE } from 'constants/general';
import { FREQUENCIES_OF_PAYMENT, ID, PRICING_BLOCK_TYPES } from 'constants/landing';
import { useSubscriptionData } from 'hooks/useSubscriptionData';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserAdmin } from 'services/security/accessServices';
import { findPlatformById } from 'services/HyperProgramService';
import { getCurrentFrequenciesOfPayment } from 'services/PricingPlanServices';
import { checkIsFreePlanCookie } from 'utils/general';

import style from 'assets/style/components/Subscription.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render subscription section
 *
 * @constructor
 */
const StaticSubscriptionSection = () => {
  const { isLoading, initialSlide, pricingData, setActiveSlide } = useSubscriptionData();
  const {
    selectedPlatform,
    platforms,
    selectedPlatform: { role }
  } = useWallSelection();
  const frequencyData = getCurrentFrequenciesOfPayment(initialSlide, pricingData, FREQUENCIES_OF_PAYMENT);
  const platform = findPlatformById(platforms, selectedPlatform.id) as any;
  const planData =
    platform &&
    (pricingData.find(el => {
      return Object.values(el).find(
        element => element.className === ID && element.content === platform.platformType.id
      );
    }) as any);

  if (isLoading) return <Loading type={LOADER_TYPE.PAGE} />;
  if (initialSlide === false) return null;

  return (
    <div className={`${coreStyle['flex-start']} ${coreStyle['flex-wrap']}`}>
      <StaticPricingPlan
        {...{ pricingData: planData, initialSlide, columnIndex: platform.platformType.id }}
        type={PRICING_BLOCK_TYPES.SUBSCRIPTION}
        setActiveSlide={setActiveSlide}
      />
      <div className={`${coreStyle.mLargeWidthFull} ${style.freqOfPaymentWrapperSettings}`}>
        {!checkIsFreePlanCookie() && isUserAdmin(role) && frequencyData ? (
          <FrequencyPlanBlock
            cta={false}
            plan={frequencyData.find(el => el.frequencyType === platform.frequencyOfPayment.frequencyType)}
          />
        ) : (
          <FreemiumPaymentBlock />
        )}
        <UpgradePan />
      </div>
    </div>
  );
};

export default StaticSubscriptionSection;
