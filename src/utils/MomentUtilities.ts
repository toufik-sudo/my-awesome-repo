import moment from 'moment';

import { COMMUNICATION_FORMAT_DATE, DAYS, MONTHS, YEARS } from 'constants/general';
import { IPeriod } from 'interfaces/IPeriod';

class MomentUtilities {
  /**
   * Method used to get time between two dates (days and months)
   *
   * @param start
   * @param end
   */
  getDiff(start, end) {
    const momentStart = moment(start);
    const momentEnd = moment(end);
    const dayDifference = momentEnd.diff(momentStart, DAYS);
    const monthDifference = momentEnd.diff(momentStart, MONTHS);
    const yearDifference = momentEnd.diff(momentStart, YEARS);

    return { dayDifference, monthDifference, yearDifference };
  }

  /**
   * Formats given date according to ISO format (eg: 2020-03-24)
   * @param date
   */
  static formatDateAsIso(date: string | number | Date = new Date()) {
    return new Date(date).toISOString().split('T')[0];
  }

  static formatDate(date: string, formatter = COMMUNICATION_FORMAT_DATE) {
    return moment(date).format(formatter);
  }

  /**
   * Creates a period from the given date adding the given number of days.
   * When the @param durationInDays is a negative number, the endDate of
   * the computed period is the given date.
   *
   * @param fromDate
   * @param durationInDays
   */
  static buildDaysPeriod(fromDate: string | number | Date, durationInDays: number): IPeriod {
    const toDate = moment(fromDate)
      .add(durationInDays, 'days')
      .toDate();

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
  }

  /**
   * Adds given number of days to date
   * @param date
   * @param days
   */
  static addDays(date: string | number | Date, days: number) {
    return moment(date)
      .add(days, 'days')
      .toDate();
  }

  /**
   * Returns whether the given dates have the same day
   * @param date
   * @param dateToTest
   */
  static isSameDate(date: string | number | Date, dateToTest: string | number | Date) {
    return moment(date).isSame(dateToTest, 'day');
  }

  /**
   * Returns whether given date is before @param maxPreviousDate. Time is ignored.
   * @param date
   * @param maxPreviousDate
   */
  static isDateBefore(date: string | number | Date, maxPreviousDate: Date) {
    return moment(date).isBefore(maxPreviousDate, 'day');
  }

  /**
   * Returns whether given date is within any the given periods. Time is ignored.
   * @param date
   * @param periods
   */
  static isDayWithinAnyPeriod(date: string | number | Date, periods: IPeriod[]) {
    const mDate = moment(date);

    return !!periods.find(
      period => mDate.isSameOrAfter(period.startDate, 'day') && mDate.isSameOrBefore(period.endDate, 'day')
    );
  }

  /**
   * Returns start of day for given date
   * @param date
   */
  static getStartOfDay(date: string | number | Date): Date {
    return moment(date)
      .utc()
      .startOf('day')
      .toDate();
  }

  /**
   * Returns end of day for given date
   * @param date
   */
  static getEndOfDay(date: string | number | Date): Date {
    return moment(date)
      .utc()
      .add(1, 'd')
      .endOf('day')
      .toDate();
  }

  /**
   * Returns end of day for given date
   * Example: endDate=2020-06-03T16:01:20.999Z to endDate=2020-06-03T23:59:59.999Z
   * @param date
   */
  static getEndOfGivenDay(date: string | number | Date): Date {
    return moment(date)
      .utc()
      .add(0, 'd')
      .endOf('day')
      .toDate();
  }
}

export default MomentUtilities;
