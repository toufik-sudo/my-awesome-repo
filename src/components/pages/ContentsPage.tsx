/* eslint-disable quotes */
import React, { createContext } from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import ContentsPageWrapperForm from 'components/organisms/form-wrappers/ContentPageWrapperForm';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { useContentPageData } from 'hooks/launch/contents/useContentPageData';
import { redirectToFirstStep, redirectToRoute } from 'services/LaunchServices';

import style from 'assets/style/components/launch/Launch.module.scss';
import { useHistory, useParams } from 'react-router-dom';
import { FREEMIUM, LAUNCH_TO_SOCIAL_NETWORKS } from 'constants/routes';

export const ContentsCoverContext = createContext(null);

/**
 * Template component used to render Contents Step page
 *
 * @constructor
 */
const ContentsPage = () => {
  const { step, stepIndex } = useParams();
  const { brandSubtitle, launchHeadingExtraInfo } = style;
  // let contentCoverConfigVal;
  const { contentCoverConfig } = useContentPageData(stepIndex);
  const { confidentiality, type } = useSelector((store: IStore) => store.launchReducer);

  if (!confidentiality || !type) redirectToFirstStep();
  const history = useHistory();

  if (parseInt(stepIndex) > 1 && parseInt(stepIndex) <= 5 && type != FREEMIUM) {
    history.push(LAUNCH_TO_SOCIAL_NETWORKS);
    // redirectToRoute(LAUNCH_TO_SOCIAL_NETWORKS);
  }

  if (stepIndex == 6 && type != FREEMIUM) {
    history.push(LAUNCH_TO_SOCIAL_NETWORKS);
    //redirectToRoute(LAUNCH_TO_SOCIAL_NETWORKS);
  }

  return (
    <ContentsCoverContext.Provider value={contentCoverConfig}>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.contents.title"
        subtitleCustomClass={brandSubtitle}
      />
      <DynamicFormattedMessage id="launchProgram.contents.info" tag="p" className={launchHeadingExtraInfo} />
      <ContentsPageWrapperForm stepIndex={stepIndex} />
    </ContentsCoverContext.Provider>
  );
};

export default ContentsPage;
