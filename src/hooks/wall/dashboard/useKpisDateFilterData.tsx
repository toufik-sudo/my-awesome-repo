import { useEffect, useState } from 'react';

import usePrevious from 'hooks/general/usePrevious';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getDefaultStartDate } from 'services/WallServices';
import { isUserBeneficiary } from 'services/security/accessServices';

/**
 * Hook used to manage kpis data
 */
export const useKpisDateFilterData = () => {
  const { programs } = useWallSelection();
  const [date, setKpisDateFilter] = useState({ startDate: null, endDate: new Date() });
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const {
    selectedPlatform: { role, id }
  } = useWallSelection();
  const prevState = usePrevious({ date, id });
  const defaultStartDate = programs.length && getDefaultStartDate(programs);
  const isBeneficiary = isUserBeneficiary(role);

  const resetFilters = () => {
    setKpisDateFilter({ startDate: getDefaultStartDate(programs), endDate: new Date() });
    setShouldUpdate(true);
  };

  const onDateChanged = values => {
    setKpisDateFilter(values);
    setShouldUpdate(true);
  };

  useEffect(() => {
    if (programs.length && ((prevState && prevState.id !== id) || !date.startDate)) {
      setKpisDateFilter({ startDate: getDefaultStartDate(programs), endDate: new Date() });
      setShouldUpdate(true);
    }
  }, [id, programs]);

  return { date, resetFilters, onDateChanged, defaultStartDate, shouldUpdate, setShouldUpdate, isBeneficiary };
};
