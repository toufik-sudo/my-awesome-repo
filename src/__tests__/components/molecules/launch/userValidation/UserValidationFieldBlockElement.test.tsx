import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserValidationFieldBlockElement from 'components/molecules/launch/userValidation/UserValidationFieldBlockElement';

describe('UserValidationFieldBlockElement', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <UserValidationFieldBlockElement index="1" label="test" />
      </ProvidersWrapper>
    );
  });
});
