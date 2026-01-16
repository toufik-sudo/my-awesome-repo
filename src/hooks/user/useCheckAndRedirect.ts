import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { UserContext } from 'components/App';
import { ECARD_CONVERSION, SETTINGS, WALL } from 'constants/routes';
import { ACCOUNT, PAYMENT } from 'constants/wall/settings';
import { useUserRole } from 'hooks/user/useUserRole';
import { getUserAuthorizations, isAnyKindOfAdmin, isAnyKindOfManager } from 'services/security/accessServices';
import { getExternalUserPaypalLink } from 'services/UserDataServices';

/**
 * Hook used to check if user has paypal link added to account,
 * and if not, redirect to edit account page and highlight paypalLink field
 */
export const useCheckAndRedirect = () => {
  const { userData } = useContext(UserContext);
  const history = useHistory();
  const role = useUserRole();
  const userRights = getUserAuthorizations(role);
  const isAnyAdmin = isAnyKindOfAdmin(userRights);
  // const isAnyManager = isAnyKindOfManager(userRights);
  // const internalLink = isAnyAdmin || !userData.paypalLink;
  // const [beneficiaryRewardsRoute, setBeneficiaryRewardsRoute] = useState(`/${WALL}${SETTINGS}/${ACCOUNT}`);

  // useEffect(() => {
  //   if (!isAnyAdmin && userData.paypalLink) {
  //     const { link } = getExternalUserPaypalLink(userData);
  //     setBeneficiaryRewardsRoute(link);
  //   }
  // }, [userData]);

  const onRewardsRedirect = (isCardConvert: boolean, isSettings: boolean) => {
    // if (isAnyAdmin || isAnyManager) {
    //   history.push({ pathname: `/${WALL}${ECARD_CONVERSION}`, state: { fromSetCard: true } });
    //   return;
    // }
    // if (!internalLink) {
    //     window.open(beneficiaryRewardsRoute, '_blank');
    //     window.focus();
    //     return;
    //   }
    let beneficiaryRewardsRoute = '';
    if(isSettings){
      beneficiaryRewardsRoute = `/${WALL}${SETTINGS}/${ACCOUNT}`;
      history.push({ pathname: beneficiaryRewardsRoute, state: { fromSetCard: true, missingPaypalLink: true } });
      return;
    }
    if (isCardConvert) {
      // beneficiaryRewardsRoute = `/${WALL}${ECARD_CONVERSION}`;
      // history.push({ pathname: beneficiaryRewardsRoute, state: { fromSetCard: true, missingPaypalLink: true } });
      // return;
      window.location.reload();
    }
    // history.push({ pathname: `/${WALL}${ECARD_CONVERSION}`, state: { fromSetCard: true } });
    // window.location.reload();
  };

  return { onRewardsRedirect };
};
