import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import PricingPlans from 'components/organisms/landing/PricingPlans';
import ResellerModal from 'components/organisms/modals/ResellerModal';
import ResellerModalContainer from 'containers/ResellerModalContainer';
import TailoredAndResellerSection from 'components/organisms/landing/TailorAndResellerSection';
// import PricingAdditionalToggle from 'components/atoms/landing/PricingAdditionalToggle';
// import { PRICING_BLOCK_TYPES } from 'constants/landing';
import { PRICING } from 'constants/routes';
import { usePricingSectionControls } from 'hooks/landing/usePricingSectionControls';
import { LOADER_TYPE } from 'constants/general';
import landingImage from 'assets/images/HowItWorks.png';
import style from 'assets/style/components/Pricing/Pricing.module.scss';

/**
 * Organism component used to display left pricing labels and slider pricing plans
 *
 * @constructor
 */
const PricingSection = () => {
  const {
    // toggleAdditionalPricing,
    // additionalVisible,
    // pricingAdditionalData,
    isLoading,
    openResellerModal,
    pricingData
  } = usePricingSectionControls();

  if (isLoading || !pricingData.length) return <Loading type={LOADER_TYPE.PAGE} />;

  return (
    <section id={PRICING} className={style.section} style={{ backgroundImage: `url(${landingImage})` }}>
      <>
        <PricingPlans pricingData={pricingData} />
        {/*this should be uncommented if we need in the future the additional pricing block*/}
        {/*<PricingAdditionalToggle {...{ additionalVisible, toggleAdditionalPricing }} />*/}
        {/*{additionalVisible && (*/}
        {/*  <PricingPlans pricingData={pricingAdditionalData} type={PRICING_BLOCK_TYPES.ADDITIONAL} />*/}
        {/*)}*/}
        <ResellerModalContainer>{props => <ResellerModal {...props} />}</ResellerModalContainer>
      </>
      <TailoredAndResellerSection {...{ openResellerModal }} />
    </section>
  );
};

export default PricingSection;
