import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PageIndexItem from 'components/atoms/ui/PageIndexItem';

describe('Page Index Item', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <PageIndexItem index="1" />
      </ProvidersWrapper>
    );
  });
});
