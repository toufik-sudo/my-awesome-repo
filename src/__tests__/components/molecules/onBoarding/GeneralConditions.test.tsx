import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import GeneralConditions from 'components/molecules/onboarding/GeneralConditions';

describe('GeneralConditions', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <GeneralConditions />
      </ProvidersWrapper>
    );
  });
});
