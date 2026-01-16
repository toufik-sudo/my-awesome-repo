import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { numberWithSpaces } from 'utils/general';
import { NUMBER } from 'constants/validation';
import { AMOUNT_OF_DECLARATIONS, TOTAL_PROGRAM_TOKENS } from 'constants/wall/dashboard';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Dashboard.module.scss';
import xlsxDownFile from 'assets/images/icones/export-excel.png';

/**
 * Organism component used to render dashboard block
 * @param kpi
 * @param selectKpi
 * @param kpiData
 * @param selectedKpi
 * @param isAdmin
 * @constructor
 */
const DashboardBlock = ({ kpi, selectKpi, kpiData, selectedKpi, isAdmin }) => {
  const keyPrefix = 'wall.dashboard.';
  const subtitlePrefix = keyPrefix + 'subtitle.';

  const { withSecondaryColor, withGrayLightAccentColor } = coreStyle;
  const { dashboardKpi, dashboardKpiTitle, dashboardKpiWidth } = componentStyle;

  return (
    <div
      className={`${dashboardKpi} ${kpi === selectedKpi ? withSecondaryColor : withGrayLightAccentColor} ${!isAdmin ? dashboardKpiWidth : ''
        }`}
      onClick={selectKpi}
    >

      {kpi == TOTAL_PROGRAM_TOKENS && numberWithSpaces(kpiData[kpi] || 0) != 0 &&
        <span style={{ cursor: 'pointer', display: 'flex', flexDirection: 'row', gap: '5px' }} >
          <DynamicFormattedMessage className={dashboardKpiTitle} tag={HTML_TAGS.P} id={`${keyPrefix}${kpi}`} />
          <img width="30" height="30" src={xlsxDownFile} style={{ position: 'relative', bottom: '5px' }} />
        </span>
      }
      {(kpi != TOTAL_PROGRAM_TOKENS || kpi == TOTAL_PROGRAM_TOKENS && numberWithSpaces(kpiData[kpi] || 0) == 0) &&
        <DynamicFormattedMessage className={dashboardKpiTitle} tag={HTML_TAGS.P} id={`${keyPrefix}${kpi}`} />
      }

      <h3>
        {numberWithSpaces(kpiData[kpi] || 0)}
        {typeof kpiData[kpi] === NUMBER && kpi === AMOUNT_OF_DECLARATIONS && (
          <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={'label.euro'} />
        )}
      </h3>
      <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${subtitlePrefix}${kpi}`} />
    </div>
  );
};

export default DashboardBlock;
