import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import SocialNetworkList from 'components/organisms/launch/contents/SocialNetworkList';
import { DEFAULT } from 'constants/stories';
import { getSampleAction } from 'services/StoriesServices';

const SocialNetworkListStory = storiesOf('Organisms/Launch/Social network list', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <SocialNetworkList
        socialNetworks={{
          facebook: {
            value: 'facebook url',
            hasError: false,
            active: true,
            canNextStep: true
          }
        }}
        setNetwork={getSampleAction()}
      />
    </ProvidersWrapper>
  ));

export default SocialNetworkListStory;
