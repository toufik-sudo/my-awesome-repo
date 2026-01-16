import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import RankingAllocation from 'components/organisms/launch/cube/allocationForms/RankingAllocation';

describe('RankingAllocation', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <RankingAllocation index="1" />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
