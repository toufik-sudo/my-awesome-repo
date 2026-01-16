import React, { memo } from 'react';

import FraudInformation from 'components/molecules/onboarding/FraudInformation';
import GeneralConditions from 'components/molecules/onboarding/GeneralConditions';
import MultiplePlatforms from 'components/molecules/onboarding/MultiplePlatforms';
import { checkIsFreePlanCookie } from 'utils/general';
import style from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';

/**
 * Molecule component used to render personal information terms
 * @constructor
 */
const PersonalInformationTerms = () => {
  return (
    <div className={style.labelsWrapper}>
      {!checkIsFreePlanCookie() && (
        <>
          <FraudInformation />
          <MultiplePlatforms />
        </>
      )}
      <GeneralConditions />
    </div>
  );
};

export default memo(PersonalInformationTerms);
