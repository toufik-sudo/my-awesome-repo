import React from 'react';
import Cookies from 'js-cookie';
import { Redirect, useParams } from 'react-router-dom';

import EmailActivationSection from 'components/organisms/intermediary/EmailActivationSection';
import SplitWelcomeSection from 'components/organisms/intermediary/SplitWelcomeSection';
import { EMAIL_ACTIVATION, EMAIL_SENT, PAGE_NOT_FOUND, ROOT, WALL_ROUTE, WELCOME_PAGES } from 'constants/routes';
import { IArrayKey } from 'interfaces/IGeneral';
import { CAN_REDIRECT_TO_EMAIL_ACTIVATION_PAGE, USER_DATA_COOKIE } from 'constants/general';
import { getLocalStorage } from 'services/StorageServies';

/**
 * Page component that renders content based on the type query parameter (LAUNCH, TAILORED, EMAIL_ACTIVATION)
 *
 * @constructor
 */
const IntermediaryPage = () => {
  const { type }: IArrayKey<string> = useParams();
  const showEmailPageCookie = getLocalStorage(CAN_REDIRECT_TO_EMAIL_ACTIVATION_PAGE);
  const userCookie = Cookies.get(USER_DATA_COOKIE) && JSON.parse(Cookies.get(USER_DATA_COOKIE));

  if (!WELCOME_PAGES.includes(type)) return <Redirect to={PAGE_NOT_FOUND} />;
  if (type !== EMAIL_ACTIVATION) return <SplitWelcomeSection {...{ type }} />;
  if (type === EMAIL_ACTIVATION) {
    if (userCookie) return <Redirect to={WALL_ROUTE} />;
    if (!showEmailPageCookie && !userCookie) return <Redirect to={ROOT} />;
  }

  return <EmailActivationSection type={EMAIL_SENT} />;
};

export default IntermediaryPage;
