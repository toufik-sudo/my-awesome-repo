import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserInfo from 'components/molecules/wall/UserInfo';
import { UserContext } from 'components/App';

describe('Navigation', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<UserContext.Consumer>{() => <UserInfo />}</UserContext.Consumer>);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(0);
  });
});
