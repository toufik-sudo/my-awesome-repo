import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AvatarEditorActions from 'components/molecules/avatar/AvatarEditorActions';
import { DEFAULT } from 'constants/stories';
import { emptyFn } from 'utils/general';

const AvatarEditorActionsStory = storiesOf('Molecules/Avatar/Avatar editor actions', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <AvatarEditorActions closeModal={emptyFn} saveImage={emptyFn} />
    </ProvidersWrapper>
  ));

export default AvatarEditorActionsStory;
