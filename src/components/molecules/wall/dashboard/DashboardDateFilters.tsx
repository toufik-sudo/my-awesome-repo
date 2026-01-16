import React from 'react';

import Button from 'components/atoms/ui/Button';
import DashboardDatePicker from 'components/atoms/wall/dashboard/DashboardDatePicker';
import Loading from 'components/atoms/ui/Loading';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { DEFAULT_DATE_FORMAT } from 'constants/forms';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Dashboard.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render dashboard date filters
 * @param date
 * @param resetFilters
 * @param onDateChanged
 * @param defaultStartDate
 * @param isLoading
 * @constructor
 */
const DashboardDateFilters = ({ date, resetFilters, onDateChanged, defaultStartDate, isLoading }) => {
  const { startDate, endDate } = date;
  const {
    dashboardFiltersDate,
    dashboardFiltersTo,
    dashboardFiltersReset,
    dashboardFiltersSort,
    dashboardFiltersLoading,
    dashboardFiltersWrapper,
    dashboardFiltersResetWrapper
  } = componentStyle;

  if (!date.startDate && isLoading) {
    return (
      <div className={dashboardFiltersLoading}>
        <Loading type={LOADER_TYPE.LOCAL} />
      </div>
    );
  }

  return (
    <>
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={'label.sort.ByDate'} className={dashboardFiltersSort} />
      <div className={dashboardFiltersWrapper}>
        <DashboardDatePicker
          selectedDate={startDate}
          onDateChange={date => onDateChanged({ startDate: date, endDate })}
          selectsStart
          {...{ startDate, endDate }}
          className={dashboardFiltersDate}
          minDate={defaultStartDate}
          dateFormat={DEFAULT_DATE_FORMAT}
        />
        <DynamicFormattedMessage
          tag={HTML_TAGS.SPAN}
          id={'label.to'}
          className={`${dashboardFiltersTo} ${coreStyle.withDefaultColor}`}
        />
        <div className={dashboardFiltersResetWrapper}>
          <DashboardDatePicker
            minDate={startDate}
            selectedDate={endDate}
            onDateChange={date => onDateChanged({ startDate, endDate: date })}
            selectsEnd
            {...{ startDate, endDate }}
            className={dashboardFiltersDate}
            dateFormat={DEFAULT_DATE_FORMAT}
          />
          <DynamicFormattedMessage
            type={dashboardFiltersReset}
            tag={Button}
            onClick={() => resetFilters()}
            id={'label.reset'}
            className={`${dashboardFiltersReset} ${coreStyle.withDefaultColor}`}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardDateFilters;
