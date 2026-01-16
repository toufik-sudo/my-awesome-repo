import React from 'react';

import ProgramInformationBlock from 'components/molecules/wall/blocks/ProgramInformationBlock';
import RewardsMechanismBody from 'components/molecules/wall/rewards/RewardsMechanismBody';
import useToggler from 'hooks/general/useToggler';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render rewards block
 * @param programDetails
 * @param isPeopleManager
 * @constructor
 */
const RewardsMechanismBlock = ({ programDetails, isPeopleManager }) => {
  const { isActive, toggle } = useToggler(!programDetails.visitedWall);
  const { colorTitle } = useSelectedProgramDesign();

  const { w100, displayFlex, mt2, withGrayColor, textCenter, withBoldFont } = coreStyle;

  return (
    <ProgramInformationBlock
      {...{
        isBodyOpen: isActive,
        setBody: toggle,
        className: `${mt2} ${displayFlex} ${coreStyle['flex-center-vertical']} ${withGrayColor} ${withBoldFont}`
      }}
    >
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id="wall.intro.rewards.title"
        className={`${withBoldFont} ${w100} ${textCenter}`}
        style={{ color: colorTitle }}
      />
      {isActive && <RewardsMechanismBody {...{ programDetails, isPeopleManager }} />}
    </ProgramInformationBlock>
  );
};

export default RewardsMechanismBlock;
