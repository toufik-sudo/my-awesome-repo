// -----------------------------------------------------------------------------
// Date Utilities
// Migrated from old_app/src/utils/MomentUtilities.ts
// Uses date-fns instead of moment for lighter bundle
// -----------------------------------------------------------------------------

import { format, addDays, isSameDay, isBefore, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import type { IPeriod } from '@/api/types';

export const COMMUNICATION_FORMAT_DATE = 'yyyy-MM-dd';

/**
 * Formats given date according to ISO format (eg: 2020-03-24)
 */
export const formatDateAsIso = (date: string | number | Date = new Date()): string => {
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Formats date with custom format
 */
export const formatDate = (date: string | Date, formatter = COMMUNICATION_FORMAT_DATE): string => {
  return format(new Date(date), formatter);
};

/**
 * Creates a period from the given date adding the given number of days.
 */
export const buildDaysPeriod = (fromDate: string | number | Date, durationInDays: number): IPeriod => {
  const toDate = addDays(new Date(fromDate), durationInDays);

  if (durationInDays < 0) {
    return {
      startDate: toDate,
      endDate: new Date(fromDate)
    };
  }

  return {
    startDate: new Date(fromDate),
    endDate: toDate
  };
};

/**
 * Adds given number of days to date
 */
export const addDaysToDate = (date: string | number | Date, days: number): Date => {
  return addDays(new Date(date), days);
};

/**
 * Returns whether the given dates have the same day
 */
export const isSameDateDay = (date: string | number | Date, dateToTest: string | number | Date): boolean => {
  return isSameDay(new Date(date), new Date(dateToTest));
};

/**
 * Returns whether given date is before maxPreviousDate
 */
export const isDateBefore = (date: string | number | Date, maxPreviousDate: Date): boolean => {
  return isBefore(new Date(date), maxPreviousDate);
};

/**
 * Returns whether given date is within any of the given periods
 */
export const isDayWithinAnyPeriod = (date: string | number | Date, periods: IPeriod[]): boolean => {
  const dateToCheck = new Date(date);
  return periods.some(period => 
    isWithinInterval(dateToCheck, { start: period.startDate, end: period.endDate })
  );
};

/**
 * Returns start of day for given date
 */
export const getStartOfDay = (date: string | number | Date): Date => {
  return startOfDay(new Date(date));
};

/**
 * Returns end of day for given date
 */
export const getEndOfDay = (date: string | number | Date): Date => {
  return endOfDay(new Date(date));
};

// Re-export for backward compatibility
export default {
  formatDateAsIso,
  formatDate,
  buildDaysPeriod,
  addDays: addDaysToDate,
  isSameDate: isSameDateDay,
  isDateBefore,
  isDayWithinAnyPeriod,
  getStartOfDay,
  getEndOfDay
};
