import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PageIndexList from 'components/organisms/launch/PageIndexList';

describe('PageIndexList', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <PageIndexList />
      </ProvidersWrapper>
    );
  });
});
