// -----------------------------------------------------------------------------
// useAgendaLoader Hook
// Migrated from old_app/src/hooks/wall/useAgendaLoader.ts
// -----------------------------------------------------------------------------

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';
import { format } from 'date-fns';

import { useWallSelection, usePlatformIdSelection } from './useWallSelection';
import { usePrevious } from '@/hooks/general/usePrevious';
import { 
  prepareAgendaTasks, 
  createPeriodAroundDate, 
  isDayWithinAnyPeriod,
  buildDaysPeriod,
  IPeriod 
} from '@/services/wall/agenda';
import { AGENDA_DAYS_LOAD_INTERVAL, DEFAULT_ISO_DATE_FORMAT } from '@/constants/wall/posts';
import { postsApi } from '@/api/PostsApi';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AgendaLoaderResult {
  onDateChange: (date: Date, loadNext?: boolean) => void;
  isLoading: boolean;
  currentTasks: any[] | undefined;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Hook used to load tasks into agenda.
 */
const useAgendaLoader = (initialDate: Date): AgendaLoaderResult => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [periodToLoad, setPeriodToLoad] = useState<IPeriod>(createPeriodAroundDate(initialDate));
  const [dailyTasks, setDailyTasks] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentTasksKey, setCurrentTasksKey] = useState(
    format(initialDate, DEFAULT_ISO_DATE_FORMAT)
  );
  
  const selectedPlatformId = usePlatformIdSelection();
  const wallSelection = useWallSelection() as any;
  const selectedProgramId = wallSelection?.selectedProgramId;
  const agenda = wallSelection?.agenda || { reload: false };

  const isUpdating = usePrevious({ periodToLoad, selectedProgramId, selectedPlatformId });

  const loadAgenda = useCallback(
    async (period: IPeriod) => {
      if (!selectedPlatformId) return;
      
      try {
        setIsLoading(true);
        const tasks = await postsApi.getTasksWithinAgenda(
          selectedPlatformId,
          period,
          selectedProgramId
        );
        const agendaTasks = prepareAgendaTasks(tasks);
        setDailyTasks(prev => ({ ...prev, ...agendaTasks }));
      } catch (e) {
        toast.error(intl.formatMessage({ id: 'wall.agenda.load.fail' }));
      }
      setIsLoading(false);
    },
    [intl, selectedProgramId, selectedPlatformId]
  );

  const reloadAgenda = useCallback(() => {
    const period = createPeriodAroundDate(new Date(currentTasksKey));
    setDailyTasks({});
    setPeriodToLoad(period);
  }, [currentTasksKey]);

  // Load agenda when period changes
  useEffect(() => {
    setIsLoading(true);
    loadAgenda(periodToLoad).then(() => setIsLoading(false));
  }, [periodToLoad, loadAgenda]);

  // Reload when platform/program changes
  useEffect(() => {
    if (!isUpdating || !selectedPlatformId) {
      return;
    }
    reloadAgenda();
  }, [selectedPlatformId, selectedProgramId, isUpdating, reloadAgenda]);

  // Handle reload trigger from store
  useEffect(() => {
    if (agenda.reload) {
      // dispatch(setAgendaReload(false));
      reloadAgenda();
    }
  }, [agenda.reload, dispatch, reloadAgenda]);

  const onDateChange = useCallback(
    (date: Date, loadNext?: boolean) => {
      const entryKey = format(date, DEFAULT_ISO_DATE_FORMAT);
      setCurrentTasksKey(entryKey);

      if (!dailyTasks[entryKey] && !isDayWithinAnyPeriod(date, [periodToLoad])) {
        const interval = loadNext ? AGENDA_DAYS_LOAD_INTERVAL : -AGENDA_DAYS_LOAD_INTERVAL;
        setPeriodToLoad(buildDaysPeriod(date, interval));
      }
    },
    [dailyTasks, periodToLoad]
  );

  return {
    onDateChange,
    isLoading,
    currentTasks: dailyTasks[currentTasksKey]
  };
};

export default useAgendaLoader;
