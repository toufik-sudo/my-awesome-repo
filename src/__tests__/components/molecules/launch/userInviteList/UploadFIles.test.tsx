import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UploadedFiles from 'components/molecules/launch/userInviteList/UploadedFiles';

describe('UploadedFiles', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <UploadedFiles uploadResponse={[]} acceptedFiles={[]} rejectedFiles={[]} serverError="" />
      </ProvidersWrapper>
    );
  });
});
