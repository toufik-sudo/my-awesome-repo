import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserFieldElement from 'components/molecules/launch/userInviteInfo/UserFieldElement';

describe('UserFieldElement', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <UserFieldElement
          field={{ label: 'test', name: '', onBlur: jest.fn(), onChange: jest.fn(), key: 'test.test' }}
          index="1"
          selectedFields={[]}
        />
      </ProvidersWrapper>
    );
  });
});
