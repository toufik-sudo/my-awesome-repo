import React from 'react';

import { PointsConversionAutomaticPost } from './PointsConversionAutomaticPost';
import { AUTOMATIC_POST_TYPE } from 'constants/wall/points';

/**
 *
 * @param objectId
 * @param endDate
 * @param automaticType
 * @constructor
 */
export const AutomaticTypeAdditionalContent = ({ objectId, endDate = undefined, automaticType = undefined }) => {
  if (AUTOMATIC_POST_TYPE.POINTS_CONVERSION_REQUEST === automaticType) {
    return <PointsConversionAutomaticPost id={objectId} canSubmit={!endDate} />;
  }
  return null;
};
