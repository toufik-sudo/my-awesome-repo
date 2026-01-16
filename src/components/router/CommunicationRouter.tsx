import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CommunicationPage from 'components/pages/communication/CommunicationPage';
import UserListFormPage from 'components/pages/communication/UserListFormPage';
import CreateCampaignPage from 'components/pages/communication/CreateCampaignPage';
import Loading from 'components/atoms/ui/Loading';
import {
  ALL_ROUTES,
  COMMUNICATION_FORM_EMAIL_CAMPAIGN_ROUTE,
  COMMUNICATION_FORM_USER_LIST_ROUTE,
  PAGE_NOT_FOUND,
  WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE,
  WALL_COMMUNICATION_USER_LIST_ROUTE
} from 'constants/routes';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { LOADER_TYPE } from 'constants/general';

/**
 * Router component used to render communication inside routes
 * @constructor
 */
const CommunicationRouter = () => {
  const { loadingPlatforms } = useWallSelection();
  if (loadingPlatforms) {
    return <Loading type={LOADER_TYPE.COMMUNICATION} />;
  }

  return (
    <Switch>
      <Route path={COMMUNICATION_FORM_EMAIL_CAMPAIGN_ROUTE} component={CreateCampaignPage} />
      <Route path={COMMUNICATION_FORM_USER_LIST_ROUTE} component={UserListFormPage} />
      <Route path={WALL_COMMUNICATION_USER_LIST_ROUTE} component={CommunicationPage} />
      <Route
        path={WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE}
        render={props => <CommunicationPage {...props} isEmailCampaign />}
      />
      <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
    </Switch>
  );
};

export default CommunicationRouter;
