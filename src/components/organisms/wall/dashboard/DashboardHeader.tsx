import React from 'react';

import DashboardDateFilters from 'components/molecules/wall/dashboard/DashboardDateFilters';

import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Dashboard.module.scss';
import userHeaderStyle from 'sass-boilerplate/stylesheets/components/wall/UsersHeader.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render dashboard header
 * @param date
 * @param resetFilters
 * @param onDateChanged
 * @param defaultStartDate
 * @param isLoading
 * @constructor
 */
const DashboardHeader = ({ date, resetFilters, onDateChanged, defaultStartDate, isLoading }) => {
  const { colorSidebar } = useSelectedProgramDesign();

  return (
    <>
      <div
        className={`${userHeaderStyle.usersHeader} ${componentStyle.dashboardFilters} ${coreStyle.pt1} ${coreStyle['flex-align-items-start']}`}
        style={{ backgroundColor: colorSidebar }}
      >
        <DashboardDateFilters {...{ date, resetFilters, onDateChanged, defaultStartDate, isLoading }} />
      </div>
    </>
  );
};

export default DashboardHeader;
