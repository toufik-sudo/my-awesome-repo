import React, { useMemo, useContext } from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import ProgramsPage from 'components/pages/programs/ProgramsPage';
import ProgramJoinPage from 'components/pages/programs/ProgramJoinPage';
import Loading from 'components/atoms/ui/Loading';
import HyperProgramPage from 'components/pages/programs/HyperProgramPage';
import AuthorizedRoute from 'components/organisms/layouts/AuthorizedRoute';
import { ALL_ROUTES, PAGE_NOT_FOUND, WALL_PROGRAM_JOIN_ROUTE } from 'constants/routes';
import { LOADER_TYPE } from 'constants/general';
import { UserContext } from 'components/App';
import { hasAtLeastSuperRole } from 'services/security/accessServices';

/**
 * Router component used to render program related routes
 * @constructor
 */
const ProgramRouter = () => {
  const routerMatch = useRouteMatch();
  const { userData, componentLoading } = useContext(UserContext);
  const isAtLeastSuperUser = useMemo(() => !componentLoading && hasAtLeastSuperRole(userData.highestRole), [
    userData,
    componentLoading
  ]);

  return (
    <Switch>
      <AuthorizedRoute
        exact
        path={routerMatch.path}
        render={() => {
          if (componentLoading) {
            return <Loading type={LOADER_TYPE.FULL_PAGE} />;
          }

          if (isAtLeastSuperUser) {
            return <HyperProgramPage />;
          }

          return <ProgramsPage />;
        }}
      />

      <AuthorizedRoute exact path={WALL_PROGRAM_JOIN_ROUTE} component={ProgramJoinPage} />
      <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
    </Switch>
  );
};

export default ProgramRouter;
