import React, { ReactElement } from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { numberWithSpaces } from 'utils/general';

import style from 'sass-boilerplate/stylesheets/components/hyperadmin/Metrics.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import xlsxDownFile from 'assets/images/icones/export-excel.png';

/**
 * Molecule component used to render metric block
 *
 * @param titleKey
 * @param value
 * @param comingSoonContent
 *
 * @constructor
 */
const MetricBlock = ({ titleKey, value, comingSoonContent = false, onClick = null, isLink = false, isImage = false }) => {
  let currency: string | ReactElement = '';
  let contentClass = style.singleMetricValue;
  if (comingSoonContent) {
    contentClass = style.singleMetricComingSoon;
  }

  if (titleKey === 'totalPointsInValue') {
    currency = <DynamicFormattedMessage id="label.euro" tag={HTML_TAGS.SPAN} />;
  }

  return (
    <GeneralBlock className={style.singleMetric}>
      <p className={style.singleMetricTitle} onClick={onClick} style={{ cursor: isLink ? 'pointer' : 'default', display: isLink ? 'flex' : 'block', flexDirection: 'row', gap: '5px' }}>
        <FormattedHTMLMessage id={`metrics.${titleKey}`} />
        {isImage && <img width="30" height="30" src={xlsxDownFile} />}
      </p>
      <span className={contentClass} onClick={onClick}>
        {numberWithSpaces(value)}
        {currency}
      </span>
    </GeneralBlock>
  );
};

export default MetricBlock;
