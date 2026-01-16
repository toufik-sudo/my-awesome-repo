import React from 'react';
import { useParams, Redirect } from 'react-router';

import { INVITED_ADMIN_PLATFORM } from 'constants/general';
import { IArrayKey } from 'interfaces/IGeneral';
import { CREATE_ADMIN_DEFAULT_ACCOUNT_ROUTE, PAGE_NOT_FOUND } from 'constants/routes';
import { setLocalStorage } from 'services/StorageServies';

/**
 * Middleware page component used to set platform id required for admin invitation
 *
 * @constructor
 */
const CreateAdminAccountPage = () => {
  const params = useParams<IArrayKey<string>>();
  let target: string = PAGE_NOT_FOUND;

  if (params.platformId) {
    setLocalStorage(INVITED_ADMIN_PLATFORM, params.platformId);
    target = CREATE_ADMIN_DEFAULT_ACCOUNT_ROUTE;
  }

  return <Redirect to={target} />;
};

export default CreateAdminAccountPage;
