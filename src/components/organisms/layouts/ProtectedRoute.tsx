import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import { useProtectedRoute } from 'hooks/authorization/useProtectedRoute';
import { ROOT, WALL_ROUTE } from 'constants/routes';
import { areUserDetailsPresent } from 'services/UserDataServices';
import { useUnpaidRestriction } from 'hooks/authorization/useUnpaidRestriction';
import { useUserRole } from 'hooks/user/useUserRole';

/**
 * Route wrapper that redirects to login if the user is not authenticated
 *
 * @param Component
 * @param authorizedRoles
 * @param unauthorizedRedirectRoute
 * @param rest
 * @constructor
 */
const ProtectedRoute = ({
  component: Component,
  authorizedRoles = undefined,
  unauthorizedRedirectRoute = WALL_ROUTE,
  ...rest
}) => {
  const { isAuthenticated, isAuthDataLoaded } = useProtectedRoute();
  const { formatMessage } = useIntl();
  useUnpaidRestriction();
  const role = useUserRole();

  if (role && authorizedRoles && !authorizedRoles.includes(role)) {
    toast(formatMessage({ id: 'toast.message.unauthorized.section' }));
    return (
      <Redirect
        to={{
          pathname: unauthorizedRedirectRoute,
          state: {
            prevLocation: rest.location.pathname
          }
        }}
      />
    );
  }
  if (!isAuthDataLoaded) return null;
  if (!areUserDetailsPresent()) {
    return (
      <Redirect
        to={{
          pathname: ROOT,
          state: {
            prevLocation: rest.location.pathname
          }
        }}
      />
    );
  }

  return (
    <Route
      {...rest}
      render={props => {
        return isAuthenticated ? (
          <Component {...{ ...props, ...rest }} />
        ) : (
          <Redirect
            to={{
              pathname: ROOT,
              state: {
                prevLocation: rest.location.pathname
              }
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
