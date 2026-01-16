import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import Button from 'components/atoms/ui/Button';
import ResultsElement from 'components/atoms/launch/results/ResultsElement';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { processTranslations } from 'services/SectionsServices';
import { IStore } from 'interfaces/store/IStore';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import buttonStyle from 'assets/style/common/Button.module.scss';
import coreStyle from '../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Template component used to render Results page
 *
 * @constructor
 */
const ResultsPage = () => {
  const { section, title, defaultTitle, centerSectionWrapper } = style;
  const {
    stepSet: { setResultValidationStep }
  } = useMultiStep();
  const { messages } = useIntl();
  const labels = useMemo(() => processTranslations(messages, 'launchProgram.results.', '.info'), [messages]);
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const resultChannels = launchStore.resultChannel;
  let buttonState = buttonStyle.disabled;
  if ((resultChannels && resultChannels.declarationForm) || (resultChannels && resultChannels.fileImport)) {
    buttonState = '';
  }

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.subtitle.rewards"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={`${section} ${centerSectionWrapper}`}>
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          className={`${title} ${defaultTitle}`}
          id="launchProgram.info.rewards"
        />
        {labels.map((label, index) => (
          <ResultsElement {...{ label, index, resultChannel: launchStore.resultChannel }} key={index} />
        ))}
        <DynamicFormattedMessage
          tag={Button}
          onClick={() => setResultValidationStep()}
          id="form.submit.next"
          className={buttonState}
        />
      </div>
    </div>
  );
};

export default ResultsPage;
