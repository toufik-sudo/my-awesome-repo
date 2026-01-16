import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, withKnobs } from '@storybook/addon-knobs';

import { HEADING_TYPE } from 'constants/stories';
import Heading from 'components/atoms/ui/Heading';
import { getText, setBackgrounds } from 'services/StoriesServices';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AnimatedTitle from 'components/atoms/ui/AnimatedTitle';
import { LANDING_TITLE } from 'constants/landing';

const HeadingStory = storiesOf('Atoms/Ui/Heading', {} as NodeModule)
  .addParameters(setBackgrounds())
  .addDecorator(withKnobs)
  .add(HEADING_TYPE.DEFAULT, () => (
    <ProvidersWrapper>
      <Heading textId={getText()} size={number('Size', 1)} />
    </ProvidersWrapper>
  ))
  .addParameters(setBackgrounds())
  .add(HEADING_TYPE.ANIMATED, () => (
    <ProvidersWrapper>
      <AnimatedTitle contentArray={LANDING_TITLE} />
    </ProvidersWrapper>
  ));

export default HeadingStory;
