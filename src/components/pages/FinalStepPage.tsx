import React from 'react';
import { useSelector } from 'react-redux';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import FinalStepWrapper from 'components/organisms/launch/finalStep/FinalStepWrapper';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { IStore } from 'interfaces/store/IStore';
import { FULL } from 'constants/wall/launch';
import { HTML_TAGS, LAUNCH } from 'constants/general';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from '../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Template component used to render Final Step page
 *
 * @constructor
 */
const FinalStepPage = () => {
  const { programName, programJourney } = useSelector((store: IStore) => store.launchReducer);
  const { title, titleLarge, centerSection, titleSection } = style;
  const programTitle = programName ? programName : '';

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId={`welcome.page.launch.${programJourney}${programJourney == FULL ? LAUNCH : ''}`}
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={centerSection}>
        <div className={titleSection}>
          <DynamicFormattedMessage
            tag={HTML_TAGS.P}
            className={`${title} ${titleLarge}`}
            id="launchProgram.finalStep.subtitle"
          />
          <p className={`${title} ${titleLarge}`}>{programTitle}.</p>
        </div>
        <FinalStepWrapper />
      </div>
    </div>
  );
};

export default FinalStepPage;
