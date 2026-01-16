import { useHistory } from 'react-router';
import { useContext } from 'react';
import Cookies from 'js-cookie';

import { UserContext } from 'components/App';
import { USER_DETAILS_COOKIE, USER_STEP_COOKIE } from 'constants/general';

const useWallLayoutData = () => {
  const history = useHistory();
  const { userData, imgLoaded } = useContext(UserContext);
  const userDetails = Cookies.get(USER_DETAILS_COOKIE);
  const currentStep = parseInt(Cookies.get(USER_STEP_COOKIE));

  return { history, userData, imgLoaded, userDetails, currentStep };
};

export default useWallLayoutData;
