import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import ProtectedRoute from 'components/organisms/layouts/ProtectedRoute';
import ProgramRouter from 'components/router/ProgramRouter';
import { ALL_ROUTES, PAGE_NOT_FOUND } from 'constants/routes';
import { WALL_TYPE } from 'constants/general';

/**
 * Router component used to set the layout and the correct routes for programs pages
 * @constructor
 */
const ProgramPreRouter = () => {
  const routerMatch = useRouteMatch();

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <Switch>
        <ProtectedRoute path={routerMatch.path} component={ProgramRouter} />
        <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
      </Switch>
    </LeftSideLayout>
  );
};

export default ProgramPreRouter;
