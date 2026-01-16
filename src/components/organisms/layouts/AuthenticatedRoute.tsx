import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useProtectedRoute } from 'hooks/authorization/useProtectedRoute';
import { WALL_ROUTE } from 'constants/routes';
import { USER_DETAILS_COOKIE } from 'constants/general';

/**
 * Route wrapper that redirects to wall page if the user is already authenticated
 *
 * @param Component
 * @param rest
 * @constructor
 */
const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isAuthDataLoaded } = useProtectedRoute();
  const userDetailsCookie = Cookies.get(USER_DETAILS_COOKIE);

  if (!userDetailsCookie && isAuthenticated) window.location.reload();
  if (!isAuthDataLoaded) return null;

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: WALL_ROUTE,
              state: {
                prevLocation: rest.location.pathname
              }
            }}
          />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
