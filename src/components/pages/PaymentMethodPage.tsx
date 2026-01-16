import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';

import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import Loading from 'components/atoms/ui/Loading';
import PaymentMethodSection from 'components/organisms/onboarding/PaymentMethodSection';
import { LOADER_TYPE, SECONDARY, USER_STEP_COOKIE } from 'constants/general';
import { REDIRECT_MAPPING, REDIRECT_STEP_ROUTES } from 'constants/routes';
import { UserContext } from 'components/App';

import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Page component used to render payment method page
 *
 * @constructor
 */
const PaymentMethodPage = () => {
  const history = useHistory();
  const { userData, imgLoaded } = useContext(UserContext);
  const currentStep = parseInt(Cookies.get(USER_STEP_COOKIE));
  if ([REDIRECT_MAPPING.PAYMENT_SUCCESS_STEP, REDIRECT_MAPPING.WALL_ROUTE_STEP].includes(currentStep)) {
    history.replace(REDIRECT_STEP_ROUTES[currentStep]);
  }

  if (!userData.firstName && !imgLoaded) return <Loading type={LOADER_TYPE.INTERMEDIARY} />;

  return (
    <LeftSideLayout theme={SECONDARY} optionalClass={componentStyle.sidebarMenuIconRight}>
      <NavLanguageSelector />
      <PaymentMethodSection />
    </LeftSideLayout>
  );
};

export default PaymentMethodPage;
