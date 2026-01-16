import React from 'react';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Freemium payment frequency block
 * @constructor
 */

const FreemiumPaymentBlock = () => {
  return (
    <GeneralBlock>
      <DynamicFormattedMessage id="subscription.frequency.freemium" tag={HTML_TAGS.P} />
    </GeneralBlock>
  );
};

export default FreemiumPaymentBlock;
