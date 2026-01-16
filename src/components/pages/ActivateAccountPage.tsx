import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import EmailActivationSection from 'components/organisms/intermediary/EmailActivationSection';
import { LOADER_TYPE } from 'constants/general';
import { EMAIL_CONFIRMED } from 'constants/routes';
import { useAccountActivation } from 'hooks/authorization/useAccountActivation';

/**
 * Page component used to render activate account page
 *
 * @constructor
 */
const ActivateAccountPage = () => {
  const userActive = useAccountActivation();

  if (!userActive) return <Loading type={LOADER_TYPE.INTERMEDIARY} />;

  return <EmailActivationSection type={EMAIL_CONFIRMED} />;
};

export default ActivateAccountPage;
