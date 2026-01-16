import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import LogoutButton from 'components/atoms/wall/LogoutButton';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('LogoutButton', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <LogoutButton />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
