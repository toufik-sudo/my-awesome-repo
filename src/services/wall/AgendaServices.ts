import { formatDate, addDaysToDate as addDays, isDateBefore, isSameDateDay as isSameDate } from '@/utils/dateUtils';
import ArrayUtilities from '@/utils/ArrayUtilities';
import { TIME_FORMAT } from '@/constants/forms';
import { AGENDA_DAYS_LOAD_INTERVAL } from '@/constants/wall/posts';

// Points conversion type for agenda filtering
export const AUTOMATIC_POST_TYPE = {
  POINTS_CONVERSION_REQUEST: 'POINTS_CONVERSION_REQUEST'
} as const;

export interface IPeriod {
  startDate: Date;
  endDate: Date;
}

/**
 * Prepares tasks for display in agenda:
 * - arranges tasks in correct order
 * - indexes them by date
 * @param tasks
 */
export const prepareAgendaTasks = (tasks: any[]) => {
  return tasks.reduce((acc, agendaEntry) => {
    acc[agendaEntry.date] = sortAgendaEntries(agendaEntry.entities);
    return acc;
  }, {} as Record<string, any[]>);
};

/**
 * Sorts agenda entries: first by time, then by title.
 * @param entries
 */
const sortAgendaEntries = (entries: any[] = []) => {
  const entriesWithTime = entries.map(entry => ({
    ...entry,
    time: formatDate(new Date(entry.startDate), TIME_FORMAT)
  }));
  entriesWithTime.sort(ArrayUtilities.sortBy(['time', 'title']));

  return entriesWithTime.filter(entry =>
    entry.isAutomatic && entry.automaticType === AUTOMATIC_POST_TYPE.POINTS_CONVERSION_REQUEST
      ? entry.endDate === null
      : entry
  );
};

/**
 * Creates a period object around the given date
 * @param initialDate
 * @param days
 */
export const createPeriodAroundDate = (initialDate: Date, days: number = AGENDA_DAYS_LOAD_INTERVAL): IPeriod => ({
  startDate: addDays(initialDate, -days / 2),
  endDate: addDays(initialDate, days / 2)
});

/**
 * Returns initial state for calendar slider
 * @param initialDate
 * @param maxPreviousDate
 */
export const initializeDates = (initialDate: Date, maxPreviousDate: Date) => {
  const currentDate = isDateBefore(initialDate, maxPreviousDate) ? maxPreviousDate : initialDate;

  return {
    current: currentDate,
    next: getNextDay(currentDate),
    previous: isSameDate(currentDate, maxPreviousDate) ? undefined : getPreviousDay(currentDate)
  };
};

/**
 * Derives next dates from current state for calendar slider
 * @param currentDates
 */
export const generateNextDates = (currentDates: any) => {
  if (!currentDates || !currentDates.current) {
    const current = new Date();

    return {
      current,
      next: getNextDay(current),
      previous: getPreviousDay(current)
    };
  }

  return {
    current: currentDates.next,
    next: getNextDay(currentDates.next),
    previous: currentDates.current
  };
};

/**
 * Derives previous dates from current state for calendar slider
 * @param currentDates
 * @param minDate
 */
export const generatePreviousDates = (currentDates: any, minDate: Date) => {
  if (!currentDates || !currentDates.previous) {
    return currentDates;
  }

  let previous: Date | undefined = undefined;
  if (currentDates.previous > minDate && !isSameDate(minDate, currentDates.previous)) {
    previous = getPreviousDay(currentDates.previous);
  }

  return {
    current: currentDates.previous,
    next: currentDates.current,
    previous
  };
};

const getNextDay = (date: Date) => addDays(date, 1);

const getPreviousDay = (date: Date) => addDays(date, -1);
