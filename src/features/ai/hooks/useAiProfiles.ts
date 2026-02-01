// -----------------------------------------------------------------------------
// useAiProfiles Hook
// Manages fetching and state of AI personalization profiles
// -----------------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';
import aiPersoApi from '@/api/AiPersoApi';
import type { IAiPersoProfile, IAiAdminProgram } from '../types';

export interface UseAiProfilesReturn {
  profiles: IAiPersoProfile[];
  adminPrograms: IAiAdminProgram[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAiProfiles(userUuid?: string): UseAiProfilesReturn {
  const [profiles, setProfiles] = useState<IAiPersoProfile[]>([]);
  const [adminPrograms, setAdminPrograms] = useState<IAiAdminProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatMessage } = useIntl();

  const fetchProfiles = useCallback(async () => {
    if (!userUuid) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiPersoApi.getIaPersoCompany({ userUuid });
      setProfiles(response.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch AI profiles';
      setError(message);
      toast.error(formatMessage({ id: 'ai.error.fetchProfiles' }, { defaultMessage: message }));
    } finally {
      setIsLoading(false);
    }
  }, [userUuid, formatMessage]);

  const fetchAdminPrograms = useCallback(async () => {
    try {
      const response = await aiPersoApi.getIaCompany();
      const programs = aiPersoApi.transformToAdminPrograms(response.data);
      setAdminPrograms(programs);
    } catch (err) {
      console.error('Failed to fetch admin programs:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchProfiles(), fetchAdminPrograms()]);
  }, [fetchProfiles, fetchAdminPrograms]);

  useEffect(() => {
    if (userUuid) {
      refresh();
    }
  }, [userUuid, refresh]);

  return {
    profiles,
    adminPrograms,
    isLoading,
    error,
    refresh,
  };
}

export default useAiProfiles;
