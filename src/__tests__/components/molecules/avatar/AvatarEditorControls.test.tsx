import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AvatarEditorControls from 'components/molecules/avatar/AvatarEditorControls';
import { AvatarContext } from 'components/pages/PersonalInformationPage';

describe('AvatarEditorControls', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <AvatarContext.Consumer>
          {() => <AvatarEditorControls avatarConfig={''} setAvatarConfig={jest.fn()} />}
        </AvatarContext.Consumer>
      </ProvidersWrapper>
    );
  });
});
