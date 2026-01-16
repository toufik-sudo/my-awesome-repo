import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import CubeRewardsTitles from 'components/molecules/launch/cube/CubeRewardsTitles';

describe('CubeRewardsTitles', () => {
  const props = {
    type: 'test'
  };
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <CubeRewardsTitles {...props} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
