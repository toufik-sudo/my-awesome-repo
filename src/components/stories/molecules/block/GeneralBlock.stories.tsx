import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import { DEFAULT } from 'constants/stories';
import GeneralBlock from 'components/molecules/block/GeneralBlock';

const GeneralBlockStory = storiesOf('Molecules/Block/General Block', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => <GeneralBlock>Test text</GeneralBlock>);

export default GeneralBlockStory;
