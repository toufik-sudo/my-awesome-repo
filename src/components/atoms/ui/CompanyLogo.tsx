import React from 'react';

import { CLOUD_REWARDS_COMPANY_LOGO_ALT } from 'constants/general';

import style from 'assets/style/components/LeftSideLayout.module.scss';

/**
 *  Molecule component used to render user company logo in left side panel
 * @param companyLogo
 * @constructor
 */
const CompanyLogo = ({ companyLogo }) => {
  const { userWrapper, icon, userWrapperLoaded, iconCompany } = style;

  return (
    <div className={`${userWrapper} ${userWrapperLoaded}`}>
      <div className={`${icon} ${iconCompany}`}>
        <img src={companyLogo} alt={CLOUD_REWARDS_COMPANY_LOGO_ALT} />
      </div>
    </div>
  );
};

export default CompanyLogo;
