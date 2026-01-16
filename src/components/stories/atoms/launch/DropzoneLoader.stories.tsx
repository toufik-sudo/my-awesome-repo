import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import DropzoneLoader from 'components/atoms/launch/DropzoneLoader';
import { DEFAULT } from 'constants/stories';

const DropzoneLoaderStory = storiesOf('Atoms/Launch/Dropzone loader', {} as NodeModule)
  .addDecorator(withKnobs)
  .add(DEFAULT, () => (
    <ProvidersWrapper>
      <DropzoneLoader />
    </ProvidersWrapper>
  ));

export default DropzoneLoaderStory;
