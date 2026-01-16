import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PersonalInformationTerms from 'components/molecules/onboarding/PersonalInformationTerms';

describe('PersonalInformationTerms', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <PersonalInformationTerms />
      </ProvidersWrapper>
    );
  });
});
