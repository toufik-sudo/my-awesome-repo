import React, { FC } from 'react';
import Cookies from 'js-cookie';

import Error404Logged from 'components/organisms/error-pages/Error404Logged';
import Error404Anonymous from 'components/organisms/error-pages/Error404Anonymous';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import { useProtectedRoute } from 'hooks/authorization/useProtectedRoute';
import { USER_STEP_COOKIE, WALL_TYPE } from 'constants/general';
import { REDIRECT_MAPPING } from 'constants/routes';

/**
 * Used for showing different 404 pages depending if you're logged in or not.
 *
 * For logged in users, the left side menu should be shown
 *
 * @constructor
 */
const NotFoundPage: FC = () => {
  const { isAuthenticated } = useProtectedRoute();
  const currentStep = parseInt(Cookies.get(USER_STEP_COOKIE));

  // if user is Authenticated and has the right to access the wall, the 404 page will contain the left sidebar as well
  if (isAuthenticated && REDIRECT_MAPPING.WALL_ROUTE_STEP == currentStep) {
    return (
      <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
        <Error404Logged />
      </LeftSideLayout>
    );
  }

  return <Error404Anonymous />;
};

export default NotFoundPage;
