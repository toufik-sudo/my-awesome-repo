import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import ProtectedRoute from 'components/organisms/layouts/ProtectedRoute';
import UserDeclarationRouter from 'components/router/UserDeclarationRouter';
import { ALL_ROUTES, PAGE_NOT_FOUND } from 'constants/routes';
import { WALL_TYPE } from 'constants/general';

/**
 * Router component used to set the layout and the correct routes for user declarations
 * @constructor
 */
const UserDeclarationPreRouter = () => {
  const routerMatch = useRouteMatch();

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <Switch>
        <ProtectedRoute path={routerMatch.path} component={UserDeclarationRouter} />
        <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
      </Switch>
    </LeftSideLayout>
  );
};

export default UserDeclarationPreRouter;
