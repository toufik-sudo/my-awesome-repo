import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PricingAdditionalToggle from 'components/atoms/landing/PricingAdditionalToggle';
import { DEFAULT } from 'constants/stories';
import { emptyFn } from 'utils/general';

const PricingAdditionalToggleStory = storiesOf('Atoms/Landing/Pricing additional toggle story', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <PricingAdditionalToggle additionalVisible={boolean('Is toggled?', false)} toggleAdditionalPricing={emptyFn} />
    </ProvidersWrapper>
  ));

export default PricingAdditionalToggleStory;
