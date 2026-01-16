import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import Dropzone from 'components/molecules/launch/userInviteList/Dropzone';

describe('Dropzone', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <Dropzone getInputProps={jest.fn()} getRootProps={jest.fn()} isDragActive />
      </ProvidersWrapper>
    );
  });
});
