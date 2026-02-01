// -----------------------------------------------------------------------------
// useAdminPrograms Hook
// Fetches programs for admin/super admin/hyper admin users
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/UsersApi';
import { useUserRole } from '@/hooks/auth';
import { getUserUuid } from '@/services/UserDataServices';
import { ROLE, ALL_ADMIN_ROLES } from '@/constants/security/access';

interface AdminProgramsResult {
  platforms: any[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Check if user role is any kind of admin
 */
const isAdminRole = (role: ROLE | null): boolean => {
  if (!role) return false;
  return ALL_ADMIN_ROLES.includes(role);
};

/**
 * Hook to fetch admin programs
 * Uses users/{uuid}/admin-programs API for admin users
 */
export const useAdminPrograms = (): AdminProgramsResult => {
  const userRole = useUserRole();
  const userUuid = getUserUuid();
  const isAdmin = isAdminRole(userRole);

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['admin-programs', userUuid],
    queryFn: async () => {
      if (!userUuid) {
        throw new Error('No user UUID available');
      }
      return usersApi.getAdminPrograms(userUuid, { platformsSize: 200 });
    },
    enabled: !!userUuid && isAdmin,
    staleTime: 60000, // 1 minute
  });

  return {
    platforms: data?.platforms || [],
    total: data?.total || 0,
    isLoading,
    isError,
    refetch
  };
};

export default useAdminPrograms;
