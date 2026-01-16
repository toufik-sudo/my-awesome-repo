import { useEffect, useState } from 'react';
import { METRICS_INTERVAL } from 'constants/general';
import HyperAdminApi from 'api/HyperAdminApi';

const hyperAdminApi = new HyperAdminApi();

/**
 * Hook used to handle metrics data
 */
export const useMetrics = () => {
  const [metricsData, setMetricsData] = useState(null);

  const getMetrics = async () => {
    const { data } = await hyperAdminApi.getMetricsData();
    setMetricsData(data);
  };

  useEffect(() => {
    (async () => getMetrics())();

    const fetchInterval = setInterval(async () => {
      await getMetrics();
    }, METRICS_INTERVAL);

    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  return { metricsData };
};
