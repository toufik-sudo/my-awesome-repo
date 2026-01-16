import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import RewardsGoalRelationsPage from 'components/pages/RewardsGoalRelationsPage';

describe('Reward goal page', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<RewardsGoalRelationsPage />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(2);
  });
});
