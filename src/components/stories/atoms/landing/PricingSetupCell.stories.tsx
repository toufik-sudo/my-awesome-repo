import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PricingSetupCell from 'components/atoms/landing/PricingSetupCell';
import { DEFAULT } from 'constants/stories';

const PricingSetupCellStory = storiesOf('Atoms/Landing/Pricing setup cell', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <PricingSetupCell columnIndex={1} outputContent={text('Text', 'Sample')} />
    </ProvidersWrapper>
  ));

export default PricingSetupCellStory;
