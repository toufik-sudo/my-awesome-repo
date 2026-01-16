import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import KPIsApi from 'api/KPIsApi';
import MomentUtilities from 'utils/MomentUtilities';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import usePrevious from 'hooks/general/usePrevious';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { DASHBOARD_FIELDS } from 'constants/wall/dashboard';
import { getUserAuthorizations, isAnyKindOfAdmin } from 'services/security/accessServices';
import { KEY_DETAILED_STATS_ENDPOINT, KEY_STATS_ENDPOINT } from 'constants/api';
import { getIndividualKpiData } from 'services/WallServices';

const kpisApi = new KPIsApi();

/**
 * Hook used to manage kpis data
 * @param date
 * @param shouldUpdate
 * @param setShouldUpdate
 */
export const useDashboardData = (date, shouldUpdate, setShouldUpdate) => {
  const {
    selectedProgramId,
    selectedPlatform: { role }
  } = useWallSelection();
  const platformId = usePlatformIdSelection();
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(DASHBOARD_FIELDS[0]);
  const [detailedKpiData, setDetailedKpiData] = useState({});
  const userRights = getUserAuthorizations(role);
  const isAdmin = isAnyKindOfAdmin(userRights);
  const intl = useIntl();
  const payload = {
    ...{
      platformId,
      programId: selectedProgramId,
      startDate: date.startDate
        ? MomentUtilities.getStartOfDay(date.startDate - date.startDate.getTimezoneOffset() * 60000)
        : MomentUtilities.getStartOfDay(date.startDate),
      endDate: MomentUtilities.getEndOfGivenDay(date.endDate)
    }
  };
  const prevState = usePrevious({ date, selectedProgramId, platformId });

  const getKPIsData = async (payload, setData, endpoint) => {
    try {
      let data = await kpisApi.getKPIs(endpoint, {
        ...payload
      });

      if (endpoint === KEY_DETAILED_STATS_ENDPOINT) {
        data = getIndividualKpiData(data);
      }
      setData({ ...data });
    } catch (e) {
      toast(intl.formatMessage({ id: 'wall.dashboard.getKpi.error' }));
    } finally {
      setIsLoading(false);
      setShouldUpdate(false);
    }
  };

  const loadAllKpiData = () => {
    setIsLoading(true);
    getKPIsData(payload, setKpiData, KEY_STATS_ENDPOINT);
    getKPIsData(payload, setDetailedKpiData, KEY_DETAILED_STATS_ENDPOINT);
  };

  useEffect(() => {
    if (
      shouldUpdate ||
      (date.startDate && prevState.date.startDate !== date.startDate) ||
      (prevState && selectedProgramId !== prevState.selectedProgramId && prevState.platformId === platformId)
    ) {
      loadAllKpiData();
    }
  }, [shouldUpdate, selectedProgramId]);

  const selectKpi = (selectedIndex, selectedKpi) => {
    setSelectedKpi(selectedKpi);
  };

  return { selectKpi, kpiData, isLoading, selectedKpi, isAdmin, detailedKpiData };
};
