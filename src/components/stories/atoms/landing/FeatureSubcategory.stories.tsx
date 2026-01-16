import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import FeatureSubcategory from 'components/atoms/landing/FeatureSubcategory';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';
import { faUserTag } from '@fortawesome/free-solid-svg-icons';

const FeatureSubcategoryStory = storiesOf('Atoms/Landing/Feature subcategory', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <FeatureSubcategory index={1} iconBlock={{ 'option.features.offer': faUserTag }} titleId={text('Text', 'Text')} />
    </ProvidersWrapper>
  ));

export default FeatureSubcategoryStory;
