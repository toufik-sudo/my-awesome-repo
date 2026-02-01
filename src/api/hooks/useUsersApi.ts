// -----------------------------------------------------------------------------
// Users API Hooks
// React Query hooks for user data fetching
// -----------------------------------------------------------------------------

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api';
import { IUserSearchCriteria, IRankingSearchCriteria } from '@/api/types';

// Query keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: IUserSearchCriteria) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
  programs: (id: string) => [...usersKeys.detail(id), 'programs'] as const,
  rankings: (id: string) => [...usersKeys.detail(id), 'rankings'] as const,
  points: (id: string) => [...usersKeys.detail(id), 'points'] as const,
  admins: (platformId: number) => [...usersKeys.all, 'admins', platformId] as const,
  ranking: () => [...usersKeys.all, 'ranking'] as const,
  rankingList: (filters: IRankingSearchCriteria) => [...usersKeys.ranking(), filters] as const,
};

/**
 * Fetch paginated list of users
 */
export function useUsers(searchCriteria: IUserSearchCriteria) {
  return useQuery({
    queryKey: usersKeys.list(searchCriteria),
    queryFn: () => usersApi.getUsers(searchCriteria),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Fetch user details by ID
 */
export function useUserDetails(userId: string | undefined) {
  return useQuery({
    queryKey: usersKeys.detail(userId || ''),
    queryFn: () => usersApi.getUserDetails(userId!),
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Fetch user's programs
 */
export function useUserPrograms(userId: string | undefined) {
  return useQuery({
    queryKey: usersKeys.programs(userId || ''),
    queryFn: () => usersApi.getUserPrograms(userId!),
    enabled: !!userId,
  });
}

/**
 * Fetch user's rankings
 */
export function useUserRankings(userId: string | undefined) {
  return useQuery({
    queryKey: usersKeys.rankings(userId || ''),
    queryFn: () => usersApi.getUserRankings(userId!),
    enabled: !!userId,
  });
}

/**
 * Fetch beneficiary points
 */
export function useBeneficiaryPoints(userId: string | undefined) {
  return useQuery({
    queryKey: usersKeys.points(userId || ''),
    queryFn: () => usersApi.getBeneficiaryPoints(userId!),
    enabled: !!userId,
  });
}

/**
 * Fetch platform administrators
 */
export function useAdmins(platformId: number | undefined) {
  return useQuery({
    queryKey: usersKeys.admins(platformId || 0),
    queryFn: () => usersApi.getAdmins(platformId!),
    enabled: !!platformId,
  });
}

/**
 * Fetch users ranking with pagination
 */
export function useUsersRanking(searchCriteria: IRankingSearchCriteria) {
  return useQuery({
    queryKey: usersKeys.rankingList(searchCriteria),
    queryFn: () => usersApi.getUsersRanking(searchCriteria),
    enabled: !!searchCriteria.platformId,
  });
}

/**
 * Update user details mutation
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Record<string, unknown> }) =>
      usersApi.updateUserDetails(userId, data),
    onSuccess: (_, { userId }) => {
      // Invalidate user details cache
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(userId) });
    },
  });
}

/**
 * Update user platform role mutation
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userUuid,
      platformRole,
    }: {
      userUuid: string;
      platformRole: { platformId: number; role: number };
    }) => usersApi.updateUserPlatformRole(userUuid, platformRole),
    onSuccess: (_, { platformRole }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.admins(platformRole.platformId) });
    },
  });
}
