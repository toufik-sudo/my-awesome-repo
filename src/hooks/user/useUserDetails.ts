import { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PAGE_NOT_FOUND, USERS_ROUTE } from '@/constants/routes';
import { isNotFound, isForbidden } from '@/utils/api';
import { usersApi } from '@/api/UsersApi';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UserDetails {
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
  programs?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  metadata?: Record<string, unknown>;
}

export interface UseUserDetailsResult {
  /** User details data */
  userDetails: UserDetails | null;
  /** Whether user details are loading */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Function to manually refresh user details */
  refreshUser: () => Promise<void>;
}

export interface UseUserDetailsOptions {
  /** Whether to fetch on mount */
  autoFetch?: boolean;
  /** Callback when user is loaded */
  onSuccess?: (user: UserDetails) => void;
  /** Callback when fetch fails */
  onError?: (error: Error) => void;
}

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

/**
 * Hook to fetch and manage user details data
 * 
 * @example
 * ```tsx
 * const { userDetails, isLoading, refreshUser } = useUserDetails(userId, {
 *   onSuccess: (user) => console.log('User loaded:', user.email)
 * });
 * ```
 */
export const useUserDetails = (
  userId: string | undefined,
  options: UseUserDetailsOptions = {}
): UseUserDetailsResult => {
  const { autoFetch = true, onSuccess, onError } = options;

  const intl = useIntl();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(autoFetch);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!userId) {
      setError('No user ID provided');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = await usersApi.getUserDetails(userId);
      
      const user: UserDetails = {
        uuid: userData.uuid || userId,
        email: userData.email || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatarUrl,
        status: userData.status === 1 ? 'active' : userData.status === 0 ? 'inactive' : 'pending',
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        programs: userData.programs?.map(p => ({ id: String(p.id), name: p.name, role: '' }))
      };

      setUserDetails(user);
      onSuccess?.(user);
    } catch (err: any) {
      const response = err?.response;

      if (isNotFound(response) || isForbidden(response)) {
        navigate(PAGE_NOT_FOUND);
        return;
      }

      const errorMessage = intl.formatMessage({
        id: 'wall.user.details.error.failedToLoad',
      });

      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(err);
      navigate(USERS_ROUTE);
    } finally {
      setIsLoading(false);
    }
  }, [userId, navigate, intl, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch && userId) {
      loadUser();
    }
  }, [autoFetch, userId, loadUser]);

  return {
    userDetails,
    isLoading,
    error,
    refreshUser: loadUser,
  };
};

export default useUserDetails;
