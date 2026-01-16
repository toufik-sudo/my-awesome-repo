import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import AvatarEditorControls from 'components/molecules/avatar/AvatarEditorControls';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { DEFAULT } from 'constants/stories';
import { emptyFn } from 'utils/general';

const AvatarEditorControlsStory = storiesOf('Molecules/Avatar/Avatar editor controls', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <AvatarEditorControls avatarConfig={{ zoom: 1, rotate: 0, name: '' }} setAvatarConfig={emptyFn} imageModal="" />
    </ProvidersWrapper>
  ));

export default AvatarEditorControlsStory;
