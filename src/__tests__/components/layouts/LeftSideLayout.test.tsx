import React from 'react';
import { UserContext } from 'components/App';
import { shallow } from 'enzyme';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';

describe('LeftSideLayout', () => {
  const wrapper = shallow(<UserContext.Consumer>{() => <LeftSideLayout children={<div />} />}</UserContext.Consumer>);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
