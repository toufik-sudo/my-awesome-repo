import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import moment from 'moment';

import PostsApi from 'api/PostsApi';
import MomentUtilities from 'utils/MomentUtilities';
import usePrevious from 'hooks/general/usePrevious';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { prepareAgendaTasks, createPeriodAroundDate } from 'services/AgendaServices';
import { AGENDA_DAYS_LOAD_INTERVAL } from 'constants/wall/posts';
import { setAgendaReload } from 'store/actions/wallActions';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { DEFAULT_ISO_DATE_FORMAT } from 'constants/forms';

const postApi = new PostsApi();
/**
 * Hook used to load taks into agenda.
 */
const useAgendaLoader = (initialDate: Date) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [periodToLoad, setPeriodToLoad] = useState(createPeriodAroundDate(initialDate));
  const [dailyTasks, setDailyTasks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentTasksKey, setCurrentTasksKey] = useState(moment(initialDate).format(DEFAULT_ISO_DATE_FORMAT));
  const selectedPlatformId = usePlatformIdSelection();

  const { selectedProgramId, agenda } = useWallSelection();
  const isUpdating = usePrevious({ periodToLoad, selectedProgramId, selectedPlatformId });

  const loadAgenda = useCallback(
    async periodToLoad => {
      try {
        setIsLoading(true);
        const tasks = await postApi.getTasksWithinAgenda(selectedPlatformId, periodToLoad, selectedProgramId);
        const agendaTasks = prepareAgendaTasks(tasks);

        setDailyTasks({ ...dailyTasks, ...agendaTasks });
      } catch (e) {
        toast(intl.formatMessage({ id: 'wall.agenda.load.fail' }));
      }
      setIsLoading(false);
    },
    [intl, selectedProgramId, selectedPlatformId, dailyTasks, setIsLoading]
  );

  const reloadAgenda = useCallback(() => {
    const period = createPeriodAroundDate(new Date(currentTasksKey));
    setDailyTasks({});
    setPeriodToLoad(period);
  }, [currentTasksKey]);

  useEffect(() => {
    setIsLoading(true);
    loadAgenda(periodToLoad).then(() => setIsLoading(false));
  }, [periodToLoad]);

  useEffect(() => {
    if (!isUpdating || !selectedPlatformId) {
      return;
    }
    reloadAgenda();
  }, [selectedPlatformId, selectedProgramId]);

  useEffect(() => {
    if (agenda.reload) {
      dispatch(setAgendaReload(false));
      reloadAgenda();
    }
  }, [agenda.reload, dispatch]);

  const onDateChange = useCallback(
    (date, loadNext) => {
      const entryKey = moment(date).format(DEFAULT_ISO_DATE_FORMAT);
      setCurrentTasksKey(entryKey);

      if (!dailyTasks[entryKey] && !MomentUtilities.isDayWithinAnyPeriod(date, [periodToLoad])) {
        const interval = loadNext ? AGENDA_DAYS_LOAD_INTERVAL : -AGENDA_DAYS_LOAD_INTERVAL;
        setPeriodToLoad(MomentUtilities.buildDaysPeriod(date, interval));
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
