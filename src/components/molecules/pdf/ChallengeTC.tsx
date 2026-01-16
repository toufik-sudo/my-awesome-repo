import React from 'react';

import { DynamicTCDocument } from 'components/molecules/pdf/DynamicTCDocument';
import { CHALLENGE } from 'constants/wall/launch';

/**
 * Template for Challenge program dynamic pdf creation
 *
 * @param launchData
 * @param userData
 * @constructor
 */
const ChallengeTC = ({ launchData, userData }) => {
  return <DynamicTCDocument launchData={launchData} userData={userData} programType={CHALLENGE} />;
};

export { ChallengeTC };
