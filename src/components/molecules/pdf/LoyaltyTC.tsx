import React from 'react';

import { DynamicTCDocument } from 'components/molecules/pdf/DynamicTCDocument';
import { LOYALTY } from 'constants/wall/launch';

/**
 * Template for Loyalty program dynamic pdf creation
 *
 * @param launchData
 * @param userData
 * @constructor
 */
const LoyaltyTC = ({ launchData, userData }) => {
  return <DynamicTCDocument launchData={launchData} userData={userData} programType={LOYALTY} />;
};

export { LoyaltyTC };
