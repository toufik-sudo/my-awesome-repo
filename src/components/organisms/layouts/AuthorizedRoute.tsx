import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import { WALL_ROUTE } from 'constants/routes';
import { useUserRole } from 'hooks/user/useUserRole';

/**
 * Route wrapper that redirects to wall page if the user is already authenticated
 *
 * @param Component
 * @param authorizedRoles array of authorized roles
 * @param rest
 * @constructor
 */
const AuthorizedRoute = ({ authorizedRoles = undefined, ...rest }) => {
  const role = useUserRole();
  const { formatMessage } = useIntl();

  if (role && authorizedRoles && !authorizedRoles.includes(role)) {
    toast(formatMessage({ id: 'toast.message.unauthorized.section' }));
    return (
      <Redirect
        to={{
          pathname: WALL_ROUTE,
          state: {
            prevLocation: rest.location.pathname
          }
        }}
      />
    );
  }

  return <Route {...rest} />;
};

export default AuthorizedRoute;
