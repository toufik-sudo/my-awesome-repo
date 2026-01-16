import React from 'react';

import DashboardChart from './DashboardChart';
import { KPI_DETAILED_FIELDS } from 'constants/wall/dashboard';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render a list of charts
 * @param detailedKpiData
 * @param selectedKpi
 * @constructor
 */
const DashboardCharts = ({ detailedKpiData, selectedKpi }) => {
  const { displayBlock, withBackgroundDefault } = coreStyle;
  const dataSelected =
    detailedKpiData &&
    Object.keys(detailedKpiData).find(item => KPI_DETAILED_FIELDS[item].relatedDashboardKpi === selectedKpi);
  return (
    <div className={`${displayBlock} ${withBackgroundDefault}`}>
      {dataSelected &&
        Object.keys(detailedKpiData[dataSelected]).map((item, key) => {
          if (KPI_DETAILED_FIELDS[dataSelected].fields.indexOf(item) !== -1) {
            return (
              <DashboardChart
                {...{
                  key: key + new Date().getTime(),
                  data: detailedKpiData[dataSelected],
                  item,
                  dataSelected,
                  colors: KPI_DETAILED_FIELDS[dataSelected].colors
                }}
              />
            );
          }
        })}
    </div>
  );
};

export default DashboardCharts;
