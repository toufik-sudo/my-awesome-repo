/* eslint-disable quotes */
import React, { createContext, FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import browserUpdate from 'browser-update';
import MainRouter from './router/MainRouter';
import Toast from './atoms/ui/Toast';
import { useAuthorizationStore } from 'hooks/authorization/useAuthorizationStore';
import { useLaunchData } from 'hooks/launch/useLaunchData';
import { useUserData } from 'hooks/user/useUserData';
import { IStore } from 'interfaces/store/IStore';
import { usePlatformSelectionStore } from 'hooks/wall/slider/usePlatformSelectionStore';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useFormatMsgTranslation } from 'hooks/others/useFormatMsgTranslation';
import { REQUIRED_OPTIONS, SESSION_SHOW_OLD_BROWSER_STR } from 'constants/oldBrowser';
import { TitleComponent } from 'components/molecules/PageTitle/TitleComponent';
import { setGoogleAnalytics } from 'services/IaServices';
library.add(fab, faFacebook, faTwitter, faLinkedin);

export const UserContext = createContext<any>({});

/**
 * Main application component
 *
 * @constructor
 */
const App: FC = () => {
  const userData = useUserData();
  const textTranslations = useFormatMsgTranslation();
  useAuthorizationStore();
  useLaunchData(useSelector((store: IStore) => store.launchReducer));
  usePlatformSelectionStore(userData.userData);

  useEffect(() => {
    const options = {
      // If no required options are set, the pop-up will show if the browser is not updated to the final version
      required: REQUIRED_OPTIONS,
      text: textTranslations,
      insecure: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      no_permanent_hide: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      shift_page_down: false,
      onclose: () => {
        sessionStorage.setItem(SESSION_SHOW_OLD_BROWSER_STR, 'false');
      }
    };

    if (sessionStorage.getItem(SESSION_SHOW_OLD_BROWSER_STR) !== 'false') {
      browserUpdate(options);
    }
  }, []);

  const data = setGoogleAnalytics({});
  // console.log({ setGoogleAnalytics: data });

  return (
    <>
      <TitleComponent />
      <UserContext.Provider value={userData}>
        <MainRouter />
        <Toast />
      </UserContext.Provider>
    </>
  );
};

export default App;
