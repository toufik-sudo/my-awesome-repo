import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AvatarEditorActions from 'components/molecules/avatar/AvatarEditorActions';

describe('AvatarEditorActions', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <AvatarEditorActions closeModal={jest.fn()} saveImage={jest.fn()} />
      </ProvidersWrapper>
    );
  });
});
