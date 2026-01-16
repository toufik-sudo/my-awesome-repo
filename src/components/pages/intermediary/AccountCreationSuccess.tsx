import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router';
import qs from 'qs';

import Button from 'components/atoms/ui/Button';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import { METRICS_ROUTE, ONBOARDING_SUCCESS, PAYMENT_METHOD, REDIRECT_MAPPING, WALL_ROUTE } from 'constants/routes';
import { HTML_TAGS, IMAGES_ALT, USER_DETAILS_COOKIE, USER_STEP_COOKIE } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';
import { setCurrentStep } from 'store/actions/boardingActions';
import { useUserData } from 'hooks/user/useUserData';
import { isUserHyperAdmin } from 'services/security/accessServices';

import logo from 'assets/images/logo/logoWhite.png';
import style from 'sass-boilerplate/stylesheets/pages/IntermediaryPage.module.scss';
import styleInter from 'sass-boilerplate/stylesheets/pages/IntermediaryPage.module.scss';

/**
 * Intermediary page used for payment success
 *
 * @constructor
 */
const AccountCreationSuccess = ({ translationPrefix = 'payment.success' }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { wrapper, successIntermediary, logoSuccess, intermediaryBody } = style;
  const currentStep = parseInt(Cookies.get(USER_STEP_COOKIE));
  const { userData } = useUserData();

  const setWallStep = async () => {
    try {
      setIsLoading(true);
      await setCurrentStep(REDIRECT_MAPPING.WALL_ROUTE_STEP);
      Cookies.set(USER_STEP_COOKIE, JSON.stringify(REDIRECT_MAPPING.WALL_ROUTE_STEP));
      let platformId = null;
      const { invitedToPlatform, role } = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));
      if (history.location.pathname.includes(ONBOARDING_SUCCESS)) {
        platformId =
          invitedToPlatform || (userData && userData.invitationsRoles && userData.invitationsRoles[0].platform);
      }
      userData && !role && isUserHyperAdmin(userData.invitationsRoles[0].role)
        ? (window.location = `${METRICS_ROUTE}` as any)
        : (window.location = `${WALL_ROUTE}?${qs.stringify({ platformId }, { skipNulls: true })}` as any);
    } catch (e) {
      // Do absolutely nothing
    }
    setIsLoading(false);
  };

  if (currentStep !== REDIRECT_MAPPING.PAYMENT_SUCCESS_STEP) {
    history.replace(PAYMENT_METHOD);
  }

  return (
    <>
      {/* <NavLanguageSelector /> */}
      <div className={`${wrapper} ${successIntermediary}`}>
        <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
          <div className={styleInter.logoContainer}>
            <h1>Welcome to </h1> <img src={logo} alt="RewardzAi Logo" />
          </div>
        </SpringAnimation>
        <div className={intermediaryBody}>
          <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${translationPrefix}.body.first`} />
          <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${translationPrefix}.body.second`} />
        </div>
        <DynamicFormattedMessage
          tag={Button}
          loading={isLoading}
          type={BUTTON_MAIN_TYPE.PRIMARY}
          variant={BUTTON_MAIN_VARIANT.INVERTED}
          id="payment.success.body.cta"
          onClick={setWallStep}
          className=""
        />
      </div>
    </>
  );
};

export default AccountCreationSuccess;
