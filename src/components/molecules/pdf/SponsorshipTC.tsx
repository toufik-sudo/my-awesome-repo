import React from 'react';

import { DynamicTCDocument } from 'components/molecules/pdf/DynamicTCDocument';
import { REFERRAL } from 'constants/wall/launch';

/**
 * Template for Referral program dynamic pdf creation
 *
 * @param launchData
 * @param userData
 * @constructor
 */
const SponsorshipTC = ({ launchData, userData }) => {
  return <DynamicTCDocument launchData={launchData} userData={userData} programType={REFERRAL} />;
};

export { SponsorshipTC };
