import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import FeatureIconText from 'components/atoms/landing/FeatureIconText';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';

const FeatureIconTextStory = storiesOf('Atoms/Landing/Feature icon text', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <FeatureIconText position="1" textId={text('Text', 'Text')} />
    </ProvidersWrapper>
  ));

export default FeatureIconTextStory;
