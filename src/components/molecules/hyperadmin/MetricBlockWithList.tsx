import React from 'react';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import ArrayUtilities from 'utils/ArrayUtilities';
import { FormattedHTMLMessage } from 'react-intl';
import { getKeyByValue } from 'utils/general';
import { PROGRAM_TYPES } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/hyperadmin/Metrics.module.scss';

const arrayUtilities = new ArrayUtilities();
/**
 * Molecule component used to render metric block with list
 *
 * @param titleKey
 * @param value
 * @constructor
 */
const MetricBlockWithList = ({ titleKey, value }) => {
  return (
    <GeneralBlock className={style.singleMetric}>
      <p className={style.singleMetricTitle}>
        <FormattedHTMLMessage id={`metrics.${titleKey}`} />
      </p>
      <ul className={style.singleMetricList}>
        {arrayUtilities.sortByKeyValue(value, 'type').map(program => (
          <li key={program.type} className={style[getKeyByValue(PROGRAM_TYPES, program.type)]}>
            {getKeyByValue(PROGRAM_TYPES, program.type)} <b>{program.percent}%</b>
          </li>
        ))}
      </ul>
    </GeneralBlock>
  );
};

export default MetricBlockWithList;
