import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserValidationFieldBlock from 'components/molecules/launch/userValidation/UserValidationFieldBlock';

describe('UserValidationFieldBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <UserValidationFieldBlock />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
