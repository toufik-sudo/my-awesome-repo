// -----------------------------------------------------------------------------
// useMetrics Hook
// Migrated from old_app/src/hooks/hyperAdmin/useMetrics.ts
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { METRICS_INTERVAL } from '@/constants/general';
import { hyperAdminApi, type IMetricsData } from '@/api/HyperAdminApi';

/**
 * Hook used to handle metrics data with polling
 */
export const useMetrics = () => {
  const [metricsData, setMetricsData] = useState<IMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getMetrics = async () => {
    try {
      const data = await hyperAdminApi.getMetricsData();
      setMetricsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    getMetrics();

    // Set up polling interval
    const fetchInterval = setInterval(() => {
      getMetrics();
    }, METRICS_INTERVAL);

    // Cleanup on unmount
    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  return { metricsData, isLoading, error, refetch: getMetrics };
};

export default useMetrics;
