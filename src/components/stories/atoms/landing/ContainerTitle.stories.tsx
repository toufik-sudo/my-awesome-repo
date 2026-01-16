import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import ContainerTitle from 'components/atoms/landing/ContainerTitle';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';

const ContainerTitleStory = storiesOf('Atoms/Landing/Container title', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <ContainerTitle textId={text('Title', 'Title')} />
    </ProvidersWrapper>
  ));

export default ContainerTitleStory;
