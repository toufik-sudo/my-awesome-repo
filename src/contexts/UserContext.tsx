// -----------------------------------------------------------------------------
// UserContext
// Provides user data and authentication state across the app
// -----------------------------------------------------------------------------

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import { accountApi } from '@/api/AccountApi';
import { AUTHORIZATION_TOKEN } from '@/constants/general';
import { extractHighestUserRole } from '@/services/security/accessServices';
import { getUserUuid, saveUserData, clearUserData, getUserDetails } from '@/services/UserDataServices';
import type { RootState } from '@/store/reducers';

export interface UserData {
  uuid?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  step?: number;
  highestRole?: number;
  roles?: string[];
  invitationsRoles?: unknown[];
  avatar?: string;
  [key: string]: unknown;
}

interface UserContextValue {
  userData: UserData;
  isLoading: boolean;
  imgLoaded: boolean;
  setImgLoaded: (loaded: boolean) => void;
  refreshUserData: () => void;
  clearUser: () => void;
}

const defaultContextValue: UserContextValue = {
  userData: {},
  isLoading: false,
  imgLoaded: false,
  setImgLoaded: () => {},
  refreshUserData: () => {},
  clearUser: () => {},
};

export const UserContext = createContext<UserContextValue>(defaultContextValue);

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * UserProvider - Manages user data state and provides it via context
 * Automatically fetches user data when logged in and clears on logout
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { userLoggedIn } = useSelector((store: RootState) => store.generalReducer);

  /**
   * Fetch user data from API and update storage
   */
  const fetchUserData = useCallback(async () => {
    if (!Cookies.get(AUTHORIZATION_TOKEN)) {
      setUserData({});
      return;
    }

    const id = getUserUuid();
    if (!id) {
      setUserData({});
      return;
    }

    setIsLoading(true);
    try {
      const data = await accountApi.getUserData(id);
      const highestRole = extractHighestUserRole(data);
      const userDataWithRole: UserData = { 
        ...data, 
        highestRole,
        uuid: id 
      };
      
      // Save to cookies for persistence
      saveUserData(userDataWithRole);
      setUserData(userDataWithRole);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // On error, try to load from stored cookies
      const storedDetails = getUserDetails();
      if (storedDetails.uuid) {
        setUserData(storedDetails as UserData);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Trigger a refresh of user data
   */
  const refreshUserData = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  /**
   * Clear user data on logout
   */
  const clearUser = useCallback(() => {
    clearUserData();
    setUserData({});
    setImgLoaded(false);
  }, []);

  // Fetch user data when logged in or refresh is triggered
  useEffect(() => {
    if (userLoggedIn) {
      fetchUserData();
    } else {
      // Clear user data when logged out
      setUserData({});
    }
  }, [userLoggedIn, refreshKey, fetchUserData]);

  const contextValue: UserContextValue = {
    userData,
    isLoading,
    imgLoaded,
    setImgLoaded,
    refreshUserData,
    clearUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to access user context
 */
export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
