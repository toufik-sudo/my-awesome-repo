import React from 'react';

import SocialNetworkBlock from 'components/organisms/launch/contents/SocialNetworkBlock';

/**
 * Organism component used to render social network list
 * @param socialNetworks
 * @param setNetwork
 * @constructor
 *
 * @see SocialNetworkListStory
 */
const SocialNetworkList = ({ socialNetworks, setNetwork }) => {
  return (
    <>
      {Object.keys(socialNetworks).map(socialNetwork => (
        <SocialNetworkBlock
          socialNetwork={socialNetworks[socialNetwork]}
          key={socialNetwork}
          index={socialNetwork}
          setNetwork={setNetwork}
          icon={require(`assets/images/socials/social_icon_${socialNetwork}.svg`)}
          message={`launchProgram.contents.${socialNetwork}.info`}
        />
      ))}
    </>
  );
};

export default SocialNetworkList;
