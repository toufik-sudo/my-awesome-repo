import React from 'react';
import { useSelector } from 'react-redux';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import GoalOptionsWrapper from 'components/organisms/launch/goalOptions/GoalOptionsWrapper';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { IStore } from 'interfaces/store/IStore';
import { FULL } from 'constants/wall/launch';
import { HTML_TAGS, LAUNCH } from 'constants/general';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Page component used to render Goal Options page
 *
 * @constructor
 */
const GoalOptionsPage = () => {
  const { section, title } = style;
  const { programJourney } = useSelector((store: IStore) => store.launchReducer);

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId={`welcome.page.launch.${programJourney}${programJourney == FULL ? LAUNCH : ''}`}
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={section}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} className={title} id="launchProgram.goalOptions.subtitle" />
        <GoalOptionsWrapper />
      </div>
    </div>
  );
};

export default GoalOptionsPage;
