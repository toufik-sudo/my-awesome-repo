import React from 'react';
import { storiesOf } from '@storybook/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';
import FrequencyBlockCta from 'components/atoms/onboarding/FrequencyBlockCta';

const FrequencyBlockCtaStory = storiesOf('Atoms/Onboarding/Frequency Block Cta', {} as NodeModule).add(DEFAULT, () => (
  <ProvidersWrapper>
    <FrequencyBlockCta frequencyId={1} />
  </ProvidersWrapper>
));

export default FrequencyBlockCtaStory;
