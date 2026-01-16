import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ProgressBarList from 'components/molecules/launch/ProgressBarList';

describe('ProgressBarList', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ProgressBarList />
      </ProvidersWrapper>
    );
  });
});
