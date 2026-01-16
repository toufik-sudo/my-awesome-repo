import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import BlockElement from 'components/atoms/landing/BlockElement';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';

const BlockElementStory = storiesOf('Atoms/Landing/Block Element', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <BlockElement textId="Body" titleId="Title" additionalContentClass="" additionalTitleClass="" />
    </ProvidersWrapper>
  ));

export default BlockElementStory;
