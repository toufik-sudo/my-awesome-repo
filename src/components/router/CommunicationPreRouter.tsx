import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import CommunicationLayout from 'components/organisms/communication/layout/CommunicationLayout';
import ProtectedRoute from 'components/organisms/layouts/ProtectedRoute';
import CommunicationRouter from 'components/router/CommunicationRouter';
import { ALL_ROUTES, PAGE_NOT_FOUND } from 'constants/routes';

/**
 * Router component used to set layouts and include the correct routes for communication
 * @constructor
 */
const CommunicationPreRouter = () => {
  const routerMatch = useRouteMatch();

  return (
    <CommunicationLayout>
      <Switch>
        <ProtectedRoute path={routerMatch.path} component={CommunicationRouter} />
        <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
      </Switch>
    </CommunicationLayout>
  );
};

export default CommunicationPreRouter;
