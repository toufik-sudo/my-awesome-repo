import React from 'react';

import SocialNetworkInput from 'components/molecules/launch/contents/socialNetworkInput';
import SocialNetworkSwitch from 'components/molecules/launch/contents/socialNetworkSwitch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/launch/SocialNetworks.module.scss';

/**
 * Organism component used to render social networks list
 * @param icon
 * @param message
 * @param socialNetwork
 * @param setNetwork
 * @param index
 * @constructor
 */
const SocialNetworkBlock = ({ icon, message, socialNetwork, setNetwork, index }) => {
  const {
    socialNetworksBlock,
    socialNetworksIcon,
    socialNetworksInfo,
    socialNetworksElement,
    TextBlock,
    textIconElement
  } = style;

  return (
    <div className={socialNetworksBlock}>
      <div className={`${TextBlock} ${socialNetworksElement} ${textIconElement}`}>
        <img src={icon} alt={socialNetwork.id} className={socialNetworksIcon} />
        <DynamicFormattedMessage id={message} className={socialNetworksInfo} tag="p" />
      </div>
      <div className={socialNetworksElement}>
        <SocialNetworkSwitch {...{ setNetwork, socialNetwork, index }} />
        <SocialNetworkInput {...{ setNetwork, socialNetwork, index }} />
      </div>
    </div>
  );
};

export default SocialNetworkBlock;
