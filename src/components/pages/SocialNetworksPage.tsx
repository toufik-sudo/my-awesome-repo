import React from 'react';

import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import SocialNetworkList from 'components/organisms/launch/contents/SocialNetworkList';
import Button from 'components/atoms/ui/Button';
import useSocialNetworkData from 'hooks/launch/contents/useSocialNetworkData';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import { redirectToFirstStep } from 'services/LaunchServices';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/SocialNetworks.module.scss';
import buttonStyle from 'assets/style/common/Button.module.scss';

/**
 * Page component used to render social networks page
 * @constructor
 */
const SocialNetworksPage = () => {
  const { socialNetworksSubtitle, socialNetworksLabel, nextButtonHolder } = style;
  const {
    canNextStep,
    nextStep,
    socialNetworks,
    setNetwork,
    setCanNextStep,
    confidentiality,
    type
  } = useSocialNetworkData();

  if (!confidentiality || !type) redirectToFirstStep();

  return (
    <>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.contents.socialNetworks.subtitle"
        subtitleCustomClass={socialNetworksSubtitle}
      />
      <DynamicFormattedMessage
        id="launchProgram.contents.socialNetworks.label"
        tag={HTML_TAGS.P}
        className={socialNetworksLabel}
      />
      <SocialNetworkList {...{ socialNetworks, setNetwork, setCanNextStep }} />
      <div className={nextButtonHolder}>
        { <DynamicFormattedMessage
          tag={Button}
          disabled={!canNextStep}
          id="launchProgram.cta.go"
          className={!canNextStep ? buttonStyle.disabled : ''}
          onClick={nextStep}
        /> }
         
      </div>
    </>
  );
};

export default SocialNetworksPage;
