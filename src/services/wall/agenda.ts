// -----------------------------------------------------------------------------
// Agenda Services
// Migrated from old_app/src/services/AgendaServices.ts
// -----------------------------------------------------------------------------

import { addDays, isBefore, isSameDay, format } from 'date-fns';
import ArrayUtilities from '@/utils/ArrayUtilities';
import { AGENDA_DAYS_LOAD_INTERVAL } from '@/constants/wall/posts';
import { TIME_FORMAT } from '@/constants/forms';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface IPeriod {
  startDate: Date;
  endDate: Date;
}

export interface AgendaEntry {
  date: string;
  entities: any[];
}

export interface CalendarDates {
  current: Date;
  next: Date;
  previous?: Date;
}

// Automatic post type for filtering
const AUTOMATIC_POST_TYPE = {
  POINTS_CONVERSION_REQUEST: 'POINTS_CONVERSION_REQUEST'
};

// -----------------------------------------------------------------------------
// Date Utilities
// -----------------------------------------------------------------------------

const getNextDay = (date: Date): Date => addDays(date, 1);
const getPreviousDay = (date: Date): Date => addDays(date, -1);

/**
 * Formats a date to time format
 */
const formatDateToTime = (date: Date | string): string => {
  if (typeof date === 'string') {
    return format(new Date(date), TIME_FORMAT);
  }
  return format(date, TIME_FORMAT);
};

/**
 * Check if a day is within any of the given periods
 */
export const isDayWithinAnyPeriod = (date: Date, periods: IPeriod[]): boolean => {
  return periods.some(period => 
    !isBefore(date, period.startDate) && !isBefore(period.endDate, date)
  );
};

/**
 * Build a period from a start date and interval in days
 */
export const buildDaysPeriod = (startDate: Date, days: number): IPeriod => ({
  startDate: days >= 0 ? startDate : addDays(startDate, days),
  endDate: days >= 0 ? addDays(startDate, days) : startDate
});

// -----------------------------------------------------------------------------
// Task Preparation
// -----------------------------------------------------------------------------

/**
 * Sorts agenda entries: first by time, then by title.
 */
const sortAgendaEntries = (entries: any[] = []): any[] => {
  const entriesWithTime = entries.map(entry => ({
    ...entry,
    time: formatDateToTime(entry.startDate)
  }));
  
  entriesWithTime.sort(ArrayUtilities.sortBy(['time', 'title']));

  return entriesWithTime.filter(entry =>
    entry.isAutomatic && entry.automaticType === AUTOMATIC_POST_TYPE.POINTS_CONVERSION_REQUEST
      ? entry.endDate === null
      : true
  );
};

/**
 * Prepares tasks for display in agenda:
 * - arranges tasks in correct order
 * - indexes them by date
 */
export const prepareAgendaTasks = (tasks: AgendaEntry[]): Record<string, any[]> => {
  return tasks.reduce((acc: Record<string, any[]>, agendaEntry) => {
    acc[agendaEntry.date] = sortAgendaEntries(agendaEntry.entities);
    return acc;
  }, {});
};

/**
 * Creates a period object around the given date
 */
export const createPeriodAroundDate = (
  initialDate: Date,
  days: number = AGENDA_DAYS_LOAD_INTERVAL
): IPeriod => ({
  startDate: addDays(initialDate, -days / 2),
  endDate: addDays(initialDate, days / 2)
});

// -----------------------------------------------------------------------------
// Calendar Slider
// -----------------------------------------------------------------------------

/**
 * Returns initial state for calendar slider
 */
export const initializeDates = (initialDate: Date, maxPreviousDate: Date): CalendarDates => {
  const currentDate = isBefore(initialDate, maxPreviousDate) ? maxPreviousDate : initialDate;

  return {
    current: currentDate,
    next: getNextDay(currentDate),
    previous: isSameDay(currentDate, maxPreviousDate) ? undefined : getPreviousDay(currentDate)
  };
};

/**
 * Derives next dates from current state for calendar slider
 */
export const generateNextDates = (currentDates: CalendarDates | undefined): CalendarDates => {
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
 */
export const generatePreviousDates = (
  currentDates: CalendarDates | undefined,
  minDate: Date
): CalendarDates | undefined => {
  if (!currentDates || !currentDates.previous) {
    return currentDates;
  }

  let previous: Date | undefined;
  if (currentDates.previous > minDate && !isSameDay(minDate, currentDates.previous)) {
    previous = getPreviousDay(currentDates.previous);
  }

  return {
    current: currentDates.previous,
    next: currentDates.current,
    previous
  };
};
