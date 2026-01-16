import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import RewardsBlockList from 'components/organisms/launch/rewards/RewardsBlockList';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('RewardsBlockList', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <RewardsBlockList />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
