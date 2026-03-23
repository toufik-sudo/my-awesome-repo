import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import { DASHBOARD_API } from './dashboard.api';
import type { DashboardData } from './dashboard.types';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<DashboardData>(DASHBOARD_API.GET);
      setData(response.data);
    } catch (err: any) {
      console.error('Dashboard fetch failed:', err);
      setError(err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
};
