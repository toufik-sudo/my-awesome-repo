import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { buildEmbbededHtmlPart } from 'services/IntlServices';
import { extractPointsData } from 'services/CubeServices';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render rewards points configuration
 * @param cube
 * @param declarationManualValidation
 * @param isPeopleManager
 * @constructor
 */
const PointsConfiguration = ({ cube = {}, declarationManualValidation, isPeopleManager }) => {
  const pointsConfig = extractPointsData(cube);
  const messageRenderHelpers = {
    strong: buildEmbbededHtmlPart({ tag: HTML_TAGS.STRONG })
  };

  return (
    <>
      {isPeopleManager && (
        <DynamicFormattedMessage
          id="wall.intro.rewards.points.managerAllocation"
          tag={HTML_TAGS.P}
          values={{ ratio: <strong>{pointsConfig.managerRatio}</strong> }}
        />
      )}
      {declarationManualValidation && (
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          id={`wall.intro.rewards.results.manualValidation.${isPeopleManager ? 'peopleManager' : 'user'}`}
          values={messageRenderHelpers}
        />
      )}
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id="wall.intro.rewards.points.allocation"
        values={{
          allocationType: pointsConfig.allocationFrequency,
          ...messageRenderHelpers
        }}
      />
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id="wall.intro.rewards.points.spending"
        values={{
          spendType: pointsConfig.spendType,
          strong: buildEmbbededHtmlPart({ tag: HTML_TAGS.STRONG, className: coreStyle.withDangerColor })
        }}
      />
    </>
  );
};

export default PointsConfiguration;
