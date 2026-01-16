import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';
import { setBackgrounds } from 'services/StoriesServices';
import NavScrollElement from 'components/atoms/ui/NavScrollElement';

const NavScrollElementStory = storiesOf('Atoms/Ui/Nav scroll element', {} as NodeModule)
  .addParameters(setBackgrounds())
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <NavScrollElement title={text('Title', 'title')} />
    </ProvidersWrapper>
  ));

export default NavScrollElementStory;
