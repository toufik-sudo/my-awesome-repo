import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ErrorListTitle from 'components/atoms/launch/ErrorListTitle';

describe('Error List Title', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ErrorListTitle invalidRecordsLength="2" />
      </ProvidersWrapper>
    );
  });
});
