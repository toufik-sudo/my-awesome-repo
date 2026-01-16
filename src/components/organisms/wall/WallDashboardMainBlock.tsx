import React from 'react';
import { useHistory } from 'react-router';

import DashboardList from 'components/organisms/wall/dashboard/DashboardList';
import DashboardHeader from 'components/organisms/wall/dashboard/DashboardHeader';
import DashboardCharts from './dashboard/DashboardCharts';
import Button from 'components/atoms/ui/Button';
import Loading from 'components/atoms/ui/Loading';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useDashboardData } from 'hooks/wall/dashboard/useDashboardData';
import { useKpisDateFilterData } from 'hooks/wall/dashboard/useKpisDateFilterData';
import { LOADER_TYPE } from 'constants/general';
import { WALL_ROUTE } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Dashboard.module.scss';
import { CONTACT_BLOCK } from 'constants/wall/blocks';

/**
 * Organism component used to render wall dashboard main block
 *
 * @constructor
 */
const WallDashboardMainBlock = () => {
  const {
    date,
    resetFilters,
    onDateChanged,
    defaultStartDate,
    shouldUpdate,
    setShouldUpdate,
    isBeneficiary
  } = useKpisDateFilterData();
  const history = useHistory();
  const { selectKpi, kpiData, isLoading, selectedKpi, isAdmin, detailedKpiData } = useDashboardData(
    date,
    shouldUpdate,
    setShouldUpdate
  );

  const { py5, textCenter, withShadow, borderRadius1, withBackgroundDefault } = coreStyle;

  if (isBeneficiary) {
    history.push(WALL_ROUTE);
  }

  return (
    <div className={`${withShadow} ${borderRadius1}`}>
      <DashboardHeader {...{ date, resetFilters, onDateChanged, defaultStartDate, isLoading }} />
      {isLoading ? (
        <div className={componentStyle.dashboardListLoading}>
          <Loading type={LOADER_TYPE.DROPZONE} />
        </div>
      ) : (
        <>
          <DashboardList {...{ kpiData, selectKpi, selectedKpi, isAdmin }} />
          <DashboardCharts {...{ detailedKpiData, selectedKpi }} />
          <div className={`${py5} ${withBackgroundDefault} ${textCenter}`}>
            <DynamicFormattedMessage
              tag={Button}
              id="wall.dashboard.chart.want.more"
              onClick={() => (window.location.href = 'mailto:support@rewardzai.com')}
            />
          </div>
        </>

      )}
    </div>
  );
};

export default WallDashboardMainBlock;
