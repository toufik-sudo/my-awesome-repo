import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserFieldRow from 'components/molecules/launch/userInviteInfo/UserFieldRow';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('UserFieldRow', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <UserFieldRow selectedFields={[]} setSelectedFields={jest.fn()} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
