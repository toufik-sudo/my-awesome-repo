// -----------------------------------------------------------------------------
// useWallLayoutData Hook
// Migrated from old_app/src/hooks/wall/useWallLayoutData.ts
// -----------------------------------------------------------------------------

import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { USER_DETAILS_COOKIE, USER_STEP_COOKIE } from '@/constants/general';

export interface IUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}

export interface IWallLayoutData {
  navigate: ReturnType<typeof useNavigate>;
  userData: IUserData;
  imgLoaded: boolean;
  userDetails: string | undefined;
  currentStep: number;
}

/**
 * Hook to get wall layout related data
 */
const useWallLayoutData = (): IWallLayoutData => {
  const navigate = useNavigate();
  
  // TODO: Get from user context when migrated
  const userData: IUserData = {};
  const imgLoaded = true;
  
  const userDetails = Cookies.get(USER_DETAILS_COOKIE);
  const stepCookie = Cookies.get(USER_STEP_COOKIE);
  const currentStep = stepCookie ? parseInt(stepCookie, 10) : 0;

  return { navigate, userData, imgLoaded, userDetails, currentStep };
};

export default useWallLayoutData;
