import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { getPercentNumber, numberWithSpaces } from 'utils/general';
import { REVENUE } from 'constants/wall/dashboard';
import { NUMBER } from 'constants/validation';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Chart.module.scss';

/**
 * Organism component used to render one chart row
 * @param data
 * @param item
 * @param dataSelected
 * @param colors
 * @constructor
 */
const DashboardChart = ({ data, item, dataSelected, colors }) => {
  const { chartContainer, chartData, chartValue, chartLabel, chartColor, chartEuro, chartComingSoon } = componentStyle;
  const keyPrefix = 'wall.dashboard.chart.' + dataSelected + '.';
  const showComingSoon = data && !data[item] && data[item] !== 0;

  return (
    <div className={chartContainer}>
      <div className={chartLabel}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${keyPrefix}${item}`} />
      </div>
      <div className={chartData}>
        <div
          className={`${showComingSoon ? chartComingSoon : chartColor} ${colors[item] ? colors[item] : ''}`}
          style={{ width: `${getPercentNumber(data[item], data.total ? data.total : data.totalInPoints)}%` }}
        >
          {showComingSoon && <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="wall.dashboard.chart.comingSoon" />}
        </div>
      </div>
      <div className={chartValue}>
        {data[item] && numberWithSpaces(Math.floor(data[item] || 0))}
        {typeof data[item] === NUMBER && dataSelected === REVENUE && (
          <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={'label.euro'} className={chartEuro} />
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
