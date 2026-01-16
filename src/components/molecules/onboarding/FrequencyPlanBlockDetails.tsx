import React from 'react';

import { FREQUENCY_FIELDS } from 'constants/subscription';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/components/Subscription.module.scss';

/**
 * Atom component used to render frequency plan details
 *
 * @param plan
 * @constructor
 */
const FrequencyPlanBlockDetails = ({ plan }) => (
  <>
    {Object.keys(plan).map(planKey => {
      if (!FREQUENCY_FIELDS(plan)[planKey]) return null;

      return (
        <DynamicFormattedMessage
          key={planKey}
          tag="div"
          className={style[planKey]}
          id={FREQUENCY_FIELDS(plan)[planKey]}
          values={{ [planKey]: plan[planKey] }}
        />
      );
    })}
  </>
);

export default FrequencyPlanBlockDetails;
