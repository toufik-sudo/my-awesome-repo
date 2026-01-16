import React from 'react';

import FrequencyBlockCta from 'components/atoms/onboarding/FrequencyBlockCta';
import FrequencyPlanBlockDetails from 'components/molecules/onboarding/FrequencyPlanBlockDetails';
import style from 'assets/style/components/Subscription.module.scss';

/**
 * Molecul component used to render Frequency payment information
 * @param plan
 * @param cta
 * @constructor
 */
const FrequencyPlanBlock = ({ plan, cta = true }) => {
  return (
    <div className={style.frequencyBlock}>
      <FrequencyPlanBlockDetails {...{ plan }} />
      {cta && <FrequencyBlockCta frequencyId={plan.id} />}
    </div>
  );
};

export default FrequencyPlanBlock;
