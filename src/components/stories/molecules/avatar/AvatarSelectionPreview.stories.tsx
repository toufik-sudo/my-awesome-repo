import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AvatarSelectionPreview from 'components/molecules/avatar/AvatarSelectionPreview';
import { DEFAULT } from 'constants/stories';
import { emptyFn } from 'utils/general';

const AvatarSelectionPreviewStory = storiesOf('Molecules/Avatar/Avatar selection preview', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <AvatarSelectionPreview
        croppedAvatar="https://image.shutterstock.com/image-photo/beautiful-water-drop-on-dandelion-260nw-789676552.jpg"
        setCroppedAvatar={emptyFn}
      />
    </ProvidersWrapper>
  ));

export default AvatarSelectionPreviewStory;
