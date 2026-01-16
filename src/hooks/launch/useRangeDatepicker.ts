import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setValue } from 'services/LaunchServices';
import { START, END } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { PROGRAM_DURATION } from 'constants/wall/launch';

/**
 * Hook used to handle all logic for ran
 */
export const useRangeDatePicker = form => {
  const dispatch = useDispatch();
  const { duration } = useSelector((store: IStore) => store.launchReducer);

  const setStartValue = date => setValue(date, START, form);
  const setEndValue = date => setValue(date, END, form);

  useEffect(() => {
    if (duration && duration.start) {
      setStartValue(new Date(duration.start));
      dispatch(setLaunchDataStep({ key: PROGRAM_DURATION, value: { ...duration, start: duration.start } }));
    }
    if (duration && duration.end) {
      setEndValue(new Date(duration.end));
      dispatch(setLaunchDataStep({ key: PROGRAM_DURATION, value: { ...duration, end: duration.end } }));
    }
  }, []);

  return {
    get: {
      start: form.values.duration && form.values.duration.start,
      end: form.values.duration && form.values.duration.end
    },
    set: { start: setStartValue, end: setEndValue }
  };
};
