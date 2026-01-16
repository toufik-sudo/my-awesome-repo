import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import SubscriptionSection from 'components/organisms/onboarding/SubscriptionSection';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { SECONDARY } from 'constants/general';
import { checkIsFreePlanCookie } from 'utils/general';
import { PERSONAL_INFORMATION_ROUTE } from 'constants/routes';
import { createPlatform } from 'store/actions/boardingActions';

import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Template component that renders subscription page after the email confirmation and login
 *
 * @constructor
 */
const SubscriptionPage = () => {
  const history = useHistory();
  const platformId = usePlatformIdSelection();

  useEffect(() => {
    if (checkIsFreePlanCookie()) {
      if (!platformId) {
        createPlatform(platformId, history);
      }

      return history.replace(PERSONAL_INFORMATION_ROUTE);
    }
  }, []);

  return (
    <LeftSideLayout theme={SECONDARY} optionalClass={componentStyle.sidebarMenuIconRight}>
      <NavLanguageSelector />
      <SubscriptionSection />
    </LeftSideLayout>
  );
};

export default SubscriptionPage;
