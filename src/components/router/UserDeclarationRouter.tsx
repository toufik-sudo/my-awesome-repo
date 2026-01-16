import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import UserDeclaration from 'components/organisms/declarations/UserDeclaration';
import UserDeclarationsBlock from 'components/organisms/declarations/UserDeclarationsBlock';
import CreateUserDeclaration from 'components/organisms/declarations/CreateUserDeclaration';
import AuthorizedRoute from 'components/organisms/layouts/AuthorizedRoute';
import { ALL_ROUTES, PAGE_NOT_FOUND, CREATE_DECLARATIONS_ROUTES } from 'constants/routes';
import { ROLE, ALL_ROLES_EXCEPT_BENEFICIARY, ALL_ADMIN_ROLES } from 'constants/security/access';

/**
 * Router component used to render user declaration related routes
 * @constructor
 */
const UserDeclarationRouter = () => {
  const routerMatch = useRouteMatch();

  return (
    <Switch>
      <AuthorizedRoute
        authorizedRoles={ALL_ROLES_EXCEPT_BENEFICIARY}
        exact
        path={routerMatch.path}
        component={UserDeclarationsBlock}
      />
      <AuthorizedRoute
        authorizedRoles={[...ALL_ADMIN_ROLES, ROLE.BENEFICIARY]}
        exact
        path={`${routerMatch.path}/:id(\\d+)`}
        component={UserDeclaration}
      />
      {CREATE_DECLARATIONS_ROUTES.map(config => (
        <AuthorizedRoute
          authorizedRoles={ALL_ADMIN_ROLES}
          exact
          key={`${routerMatch.path}${config.path}`}
          path={`${routerMatch.path}${config.path}`}
          render={props => <CreateUserDeclaration {...props} type={config.type} />}
        />
      ))}

      <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
    </Switch>
  );
};

export default UserDeclarationRouter;
