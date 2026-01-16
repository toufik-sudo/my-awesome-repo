import { useHistory, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

import { USER_STEP_COOKIE } from 'constants/general';
import { NOTIFICATIONS_ROUTE, PAYMENT_SETTINGS_ROUTE } from 'constants/routes';
import { PAYMENT, SETTINGS } from 'constants/wall/settings';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { IPlatform } from 'interfaces/components/wall/IWallPrograms';
import {
  getUserAuthorizations,
  isAnyKindOfAdmin,
  isAnyKindOfManager,
  isBlockedStatus,
  isExpiredStatus,
  isUserBeneficiary
} from 'services/security/accessServices';

export const useUnpaidRestriction = () => {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const currentStep = parseInt(Cookies.get(USER_STEP_COOKIE));
  const selectedPlatform = useWallSelection().selectedPlatform as IPlatform;
  const userRights = getUserAuthorizations(selectedPlatform.role);
  const isBlockedStatusForBeneficiary =
    isUserBeneficiary(selectedPlatform.role) && isExpiredStatus(selectedPlatform.status);
  const isBlockedStatusForAdmin = isAnyKindOfAdmin(userRights) && isBlockedStatus(selectedPlatform.status);
  const isBlockedStatusForManager = isAnyKindOfManager(userRights) && isBlockedStatus(selectedPlatform.status);
  const shouldRedirect =
    (isBlockedStatusForBeneficiary || isBlockedStatusForAdmin || isBlockedStatusForManager) &&
    !pathname.includes(PAYMENT) &&
    !pathname.includes(NOTIFICATIONS_ROUTE);
  useEffect(() => {
    if (pathname.indexOf(SETTINGS) === -1 && shouldRedirect) {
      push(PAYMENT_SETTINGS_ROUTE);
    }
  }, [pathname, currentStep, selectedPlatform]);
};
