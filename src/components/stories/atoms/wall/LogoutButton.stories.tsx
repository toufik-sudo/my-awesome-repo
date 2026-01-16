import React from 'react';
import { storiesOf } from '@storybook/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import LogoutButton from 'components/atoms/wall/LogoutButton';
import { DEFAULT } from 'constants/stories';
import { setBackgrounds } from 'services/StoriesServices';

const LogoutButtonStory = storiesOf('Atoms/Wall/Logout button', {} as NodeModule)
  .addParameters(setBackgrounds())
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <LogoutButton />
    </ProvidersWrapper>
  ));

export default LogoutButtonStory;
