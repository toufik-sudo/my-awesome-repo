import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ErrorLineDisplay from 'components/atoms/ui/ErrorLineDisplay';

describe('Error Line Display', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ErrorLineDisplay code="1" email="test" />
      </ProvidersWrapper>
    );
  });
});
