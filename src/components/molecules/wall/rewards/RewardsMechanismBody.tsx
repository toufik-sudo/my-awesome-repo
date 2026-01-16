import React from 'react';

import CubeGoalsDetails from 'components/molecules/wall/rewards/CubeGoalsDetails';
import PointsConfiguration from 'components/molecules/wall/rewards/PointsConfiguration';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { buildEmbbededHtmlPart } from 'services/IntlServices';
import { PROGRAM_TYPES } from 'constants/wall/launch';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';

/**
 * Component used to render rewards block
 * @param programDetails
 * @param isPeopleManager
 * @param onLaunch
 * @constructor
 */
const RewardsMechanismBody = ({ programDetails, isPeopleManager = false, onLaunch = false }) => {
  const {
    cube = {},
    products = [],
    fullProducts = [],
    fullCategoriesProducts = [],
    type,
    declarationManualValidation,
    resultsManualValidation
  } = programDetails;
  const programType = Number(type) ? type : PROGRAM_TYPES[type] || null;
  const {
    selectedPlatform: { role }
  } = useWallSelection();
  const isBeneficiary = isUserBeneficiary(role);
  const selectedProducts = [...products, ...fullProducts, ...fullCategoriesProducts];

  return (
    <div className={coreStyle.mt2}>
      {programType && (
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          id="wall.intro.rewards.programType"
          values={{
            programType,
            strong: buildEmbbededHtmlPart({ tag: HTML_TAGS.STRONG })
          }}
        />
      )}
      <CubeGoalsDetails {...{ cube, products: selectedProducts, programType, isPeopleManager, onLaunch }} />
      {!isBeneficiary && cube.rewardPeopleManagerAccepted && (
        <DynamicFormattedMessage
          id="wall.intro.rewards.programManager"
          values={{ value: cube.rewardPeopleManagers }}
          tag={HTML_TAGS.SPAN}
        />
      )}
      {isPeopleManager && cube.rewardPeopleManagerAccepted && (
        <DynamicFormattedMessage
          id="wall.intro.rewards.programManagerPeopleManager"
          values={{ value: cube.rewardPeopleManagers }}
          tag={HTML_TAGS.SPAN}
        />
      )}
      <PointsConfiguration
        {...{
          cube,
          declarationManualValidation: declarationManualValidation || resultsManualValidation,
          isPeopleManager
        }}
      />
    </div>
  );
};

export default RewardsMechanismBody;
