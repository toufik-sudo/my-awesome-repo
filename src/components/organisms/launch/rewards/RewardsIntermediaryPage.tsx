import React from 'react';
import { useSelector } from 'react-redux';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import RewardsIntermediaryPageContent from 'components/atoms/landing/RewardsIntermediaryPageContent';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { IStore } from 'interfaces/store/IStore';
import { redirectToFirstStep } from 'services/LaunchServices';
import { openTab } from 'utils/general';

import componentStyle from 'assets/style/components/Rewards/RewardsIntermediaryPage.module.scss';
import { FR_VALUE } from '../../../../constants/i18n';

const RewardsIntermediaryPage = () => {
  const { rewardsTerms, rewardsContent, rewardsSubTitle } = componentStyle;
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const { confidentiality, type } = launchStore;
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  const { value: selectedLanguage } = useSelector((state: IStore) => state.languageReducer.selectedLanguage);
  const tcDocUrl =
    process.env[selectedLanguage === FR_VALUE ? 'REACT_APP_FREEMIUM_TC_URL_FR' : 'REACT_APP_FREEMIUM_TC_URL_EN'];
  if (!confidentiality || !type) redirectToFirstStep();

  return (
    <div>
      <LaunchProgramTitle
        subtitleCustomClass={rewardsSubTitle}
        titleId="launchProgram.title"
        subtitleId="launchProgram.rewards.subtitle"
      />
      <div className={rewardsContent}>
        <RewardsIntermediaryPageContent />
        <div>
          <ButtonFormatted
            onClick={() => setNextStep()}
            buttonText="launchProgram.rewards.go.next"
            type={BUTTON_MAIN_TYPE.PRIMARY}
          />
        </div>
        <DynamicFormattedMessage
          tag={HTML_TAGS.ANCHOR}
          className={rewardsTerms}
          onClick={event => openTab(event, tcDocUrl)}
          id="launchProgram.rewards.terms.and.cond"
          href={tcDocUrl}
        />
      </div>
    </div>
  );
};

export default RewardsIntermediaryPage;
