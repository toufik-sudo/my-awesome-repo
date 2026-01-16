import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import TopControlsList from 'components/molecules/wall/TopControlsList';

describe('TopControlsList', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<TopControlsList />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(3);
  });
});
