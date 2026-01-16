import React from 'react';
import { useSelector } from 'react-redux';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import RewardsMechanismBody from '../../molecules/wall/rewards/RewardsMechanismBody';
import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { IStore } from 'interfaces/store/IStore';
import { FULL } from 'constants/wall/launch';
import { HTML_TAGS, LAUNCH } from 'constants/general';
import { useSelectedProgramDesign } from '../../../hooks/wall/ui/useSelectedProgramColors';
import { useMultiStep } from '../../../hooks/launch/useMultiStep';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Page component used to render goals option preview
 *
 * @constructor
 */
const GoalsOptionsPreview = () => {
  const programDetails = useSelector((store: IStore) => store.launchReducer);
  const { setNextStep } = useMultiStep().stepSet;
  const { programJourney } = programDetails;
  const { colorTitle } = useSelectedProgramDesign();

  const { w100, btnCenter, mt5, withPrimaryColor, withBoldFont } = coreStyle;

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId={`welcome.page.launch.${programJourney}${programJourney == FULL ? LAUNCH : ''}`}
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={style.section}>
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          id="wall.intro.rewards.title"
          className={`${withPrimaryColor} ${withBoldFont} ${w100}`}
          style={{ colorTitle }}
        />
        <RewardsMechanismBody {...{ programDetails, onLaunch: true }} />
      </div>
      <div className={`${btnCenter} ${mt5}`}>
        <DynamicFormattedMessage tag={Button} id="form.submit.next" onClick={setNextStep} />
      </div>
    </div>
  );
};

export default GoalsOptionsPreview;
