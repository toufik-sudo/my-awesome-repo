import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import DropzoneResultLineDisplay from 'components/molecules/launch/userInviteList/DropzoneResultLineDisplay';

describe('DropzoneResultLineDisplay', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <DropzoneResultLineDisplay uploadResponse={{ data: { totalLines: 1, totalInvalid: 0 } }} />
      </ProvidersWrapper>
    );
  });
});
