import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import CreateAccountFormWrapper from 'components/organisms/form-wrappers/CreateAccountFormWrapper';
import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import { INVITED_ADMIN_PLATFORM, ONBOARDING_BENEFICIARY_COOKIE, SECONDARY } from 'constants/general';
import { ONBOARDING_GENERIC_ROUTE, PRICING, ROOT } from 'constants/routes';
import { usePriceData } from 'hooks/usePriceData';
import { getLocalStorage } from 'services/StorageServies';

/**
 * Page component used to render create account page
 *
 * @constructor
 */
const CreateAccountPage = () => {
  const history = useHistory();
  const params: any = useParams();
  const { pricingData } = usePriceData();
  const invitedAdmin = getLocalStorage(INVITED_ADMIN_PLATFORM);
  const onboardingBeneficiary = getLocalStorage(ONBOARDING_BENEFICIARY_COOKIE);

  // If user tries to create an account for an existing plan, he should be redirected to homepage plans
  if (params.name) {
    const namedPricingPlans = pricingData.map(priceData => {
      return priceData.find(priceRow => priceRow.className == 'name');
    });
    const plans = namedPricingPlans.map(pricePlan => pricePlan.content);
    const hasPricingParams = plans.some(data => {
      if (data.replace(/\s/g, '').toLowerCase() == params.name.replace(/\s/g, '').toLowerCase()) {
        return true;
      }
    });
    if (hasPricingParams) {
      history.push({
        pathname: `${ROOT}`,
        state: { forcedActiveSection: PRICING }
      });
    }

    return null;
  }

  // If the user came here without an invitation from email for admin,
  // he should be redirected to onboarding to set his personal info and profile image
  if (!onboardingBeneficiary && !invitedAdmin) {
    history.push(`${ONBOARDING_GENERIC_ROUTE}`);
    return null;
  }

  return (
    <LeftSideLayout theme={SECONDARY}>
      <NavLanguageSelector />
      <CreateAccountFormWrapper />
    </LeftSideLayout>
  );
};

export default CreateAccountPage;
