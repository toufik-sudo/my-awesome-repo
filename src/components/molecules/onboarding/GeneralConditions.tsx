import React from 'react';
import { FormattedMessage } from 'react-intl';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { openTab } from 'utils/general';

import style from 'assets/style/common/Labels.module.scss';
import { useLegalDocUrl } from '../../../hooks/others/useLegalDocUrl';

/**
 * Molecule component thar renders general conditions text + url
 *
 * @constructor
 */
const GeneralConditions = () => {
  const { block, center, bold } = style;
  const { legalDocUrl } = useLegalDocUrl();

  return (
    <div className={`${block} ${center}`}>
      <FormattedMessage id="personalInformation.info.general.title1" />
      <DynamicFormattedMessage
        tag={HTML_TAGS.ANCHOR}
        onClick={event => openTab(event, legalDocUrl)}
        id="personalInformation.info.general.cta"
        href={legalDocUrl}
        className={`${bold}`}
      />
      <FormattedMessage id="personalInformation.info.general.title2" />
    </div>
  );
};

export default GeneralConditions;
