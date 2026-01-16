import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import TopNavigationElement from 'components/atoms/wall/TopNavigationElement';

describe('Top Navigation Element', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <TopNavigationElement icon={<div />} url="" />
      </ProvidersWrapper>
    );
  });
});
