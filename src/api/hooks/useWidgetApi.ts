// -----------------------------------------------------------------------------
// Widget API Hooks
// React Query hooks for widget data fetching
// -----------------------------------------------------------------------------

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/UsersApi';
import { userDeclarationsApi } from '@/api/UserDeclarationsApi';
import { postsApi } from '@/api/PostsApi';
import type { IUserDeclarationSearchCriteria } from '@/api/UserDeclarationsApi';
import type { IPeriod } from '@/services/wall/agenda';

// Query keys
export const widgetKeys = {
  all: ['widgets'] as const,
  userCount: (platformId: number, programId?: number) => 
    [...widgetKeys.all, 'userCount', platformId, programId] as const,
  rankings: (platformId: number, programId?: number) => 
    [...widgetKeys.all, 'rankings', platformId, programId] as const,
  userRankings: (userId: string) => 
    [...widgetKeys.all, 'userRankings', userId] as const,
  declarations: (platformId: number, programId?: number) => 
    [...widgetKeys.all, 'declarations', platformId, programId] as const,
  agenda: (platformId: number, programId?: number) => 
    [...widgetKeys.all, 'agenda', platformId, programId] as const,
  agendaTasks: (platformId: number, period: IPeriod, programId?: number) => 
    [...widgetKeys.agenda(platformId, programId), period] as const,
  points: (userId: string, platformId?: number) => 
    [...widgetKeys.all, 'points', userId, platformId] as const,
};

/**
 * Fetch user count for a platform/program
 */
export function useUserCount(platformId: number | undefined, programId?: number) {
  return useQuery({
    queryKey: widgetKeys.userCount(platformId || 0, programId),
    queryFn: async () => {
      if (!platformId) return { total: 0 };
      
      const result = await usersApi.getUsers({
        platform: platformId,
        filters: programId ? { program: programId } : undefined,
        view: 'counter',
      });
      
      return { total: result.total || 0 };
    },
    enabled: !!platformId,
    staleTime: 30000,
  });
}

/**
 * Fetch users ranking for leaderboard widget
 */
export function useRankingWidget(
  platformId: number | undefined,
  programId?: number,
  options: { limit?: number } = {}
) {
  const { limit = 10 } = options;
  
  return useQuery({
    queryKey: widgetKeys.rankings(platformId || 0, programId),
    queryFn: async () => {
      if (!platformId) return { entries: [], total: 0 };
      
      return usersApi.getUsersRanking({
        platformId,
        programId,
        size: limit,
        offset: 0,
      });
    },
    enabled: !!platformId,
    staleTime: 60000,
  });
}

/**
 * Fetch current user's ranking data
 */
export function useCurrentUserRanking(userId: string | undefined) {
  return useQuery({
    queryKey: widgetKeys.userRankings(userId || ''),
    queryFn: async () => {
      if (!userId) return null;
      
      const rankings = await usersApi.getUserRankings(userId);
      return rankings;
    },
    enabled: !!userId,
    staleTime: 60000,
  });
}

/**
 * Fetch declarations for widget (summary view)
 */
export function useDeclarationsWidget(
  platformId: number | undefined, 
  programId?: number
) {
  return useQuery({
    queryKey: widgetKeys.declarations(platformId || 0, programId),
    queryFn: async () => {
      if (!platformId) return [];
      
      const searchCriteria: IUserDeclarationSearchCriteria = {
        platformId,
        programId,
        view: 'block',
        size: 5,
        offset: 0,
      };
      
      const result = await userDeclarationsApi.getBlockDeclarations(searchCriteria);
      return result?.data || result || [];
    },
    enabled: !!platformId,
    staleTime: 30000,
  });
}

/**
 * Fetch agenda tasks for a specific date range
 */
export function useAgendaTasks(
  platformId: number | undefined,
  period: IPeriod | undefined,
  programId?: number
) {
  return useQuery({
    queryKey: widgetKeys.agendaTasks(platformId || 0, period as IPeriod, programId),
    queryFn: async () => {
      if (!platformId || !period) return [];
      
      const tasks = await postsApi.getTasksWithinAgenda(platformId, period, programId);
      return tasks;
    },
    enabled: !!platformId && !!period,
    staleTime: 60000,
  });
}

/**
 * Fetch beneficiary points for dashboard
 */
export function useBeneficiaryPointsWidget(
  userId: string | undefined,
  platformId?: number
) {
  return useQuery({
    queryKey: widgetKeys.points(userId || '', platformId),
    queryFn: async () => {
      if (!userId) return 0;
      return usersApi.getBeneficiaryPoints(userId);
    },
    enabled: !!userId,
    staleTime: 30000,
  });
}

// Export instance for direct API calls
export { userDeclarationsApi } from '@/api/UserDeclarationsApi';
