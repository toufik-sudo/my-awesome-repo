import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AvatarSelectionPreview from 'components/molecules/avatar/AvatarSelectionPreview';

describe('AvatarSelectionPreview', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <AvatarSelectionPreview croppedAvatar={jest.fn()} setCroppedAvatar={jest.fn()} />
      </ProvidersWrapper>
    );
  });
});
